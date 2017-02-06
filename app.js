'use strict';
require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
require('isomorphic-fetch');
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// const getCompanyIntent = 'getCompany';
const companyArgument = 'company';
const marketsDataKey = process.env.markets;
function getCompany (assistant) {

  let company = assistant.getArgument(companyArgument);

  fetch(`http://markets.ft.com/research/webservices/securities/v1/search?query=${company}&source=${marketsDataKey}`)
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
    })
    .then((json) => {
      fetch(`http://markets.ft.com/research/webservices/companies/v1/profile?symbols=${json.data.searchResults[0].symbol}&source=${marketsDataKey}`).then((data) => {
        if (data.ok) {
            return data.json();
          }
        }).then((json) => {
        assistant.ask(json.data.items[0].profile.description);
      });
    }).catch((error) => {
      console.log(error)
    })
  ;

}

function moreInfo(assistant){
    const thisSessionId = assistant['request_'].body.sessionId;
    console.log('1 >>>',thisSessionId);
    if (sessionIds[thisSessionID] === undefined ){
      console.log('2 >>>', sessionIds[thisSessionID]);
      assistant.ask(`Sorry, you have to ask for a company first.`);
    } else {
      const lastRequest = sessionIds[thisSessionID][ sessionIds[thisSessionID].length - 1 ];
      console.log('3 >>>',lastRequest);
      console.log('3a >>>', lastRequest.contexts[0].metadata);
      console.log('4 >>>', lastRequest.contexts[0].metadata.intentName);

      if (lastRequest.contexts[0].metadata.intentName === "getCompany"){
        assistant.ask(`Sorry, I can't tell you anymore about ${lastRequest.result.parameters.company}`);
      } else {
        assistant.ask ("Sorry, I don't know what to do with that.");
      }


    }

}

let actionMap = new Map();
actionMap.set('getCompany', getCompany);
actionMap.set('more', moreInfo);

const sessionIds = {};

app.post('/', function (req, res) {
  const thisSessionID = req.body.sessionId;
  if (sessionIds[thisSessionID] === undefined ){
      sessionIds[thisSessionID] = [req.body];
  } else {
    sessionIds[thisSessionID].push(req.body);
  }
  console.log (sessionIds[thisSessionID], 'Number of calls:', sessionIds[thisSessionID].length);

  console.log('>>>> BODY >>>> \n\n', JSON.stringify(req.body), '\n\n');
  console.log ('req.body=', JSON.stringify(req.body));
  console.log ('EXTRACTED_SessionId=' , req.body.sessionId);
  console.log ('EXTRACTED_conversation_id=' , req.body.originalRequest.data.conversation.conversation_id);
	const assistant = new Assistant({request: req, response: res});



  // actionMap.set(getCompanyIntent, getCompany);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;

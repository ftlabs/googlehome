'use strict';
require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
require('isomorphic-fetch');
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

const getCompanyIntent = 'getCompany';
const companyArgument = 'company';
const marketsDataKey = process.env.markets;

app.post('/', function (req, res) {
  console.log ('req.body=', JSON.stringify(req.body));
  console.log ('EXTRACTED_SessionId=' , req.body.sessionId);
  console.log ('EXTRACTED_conversation_id=' , req.body.originalRequest.data.conversation.conversation_id);
	const assistant = new Assistant({request: req, response: res});
  function getCompany (assistant) {
	let company = assistant.getArgument(companyArgument);

	fetch(`http://markets.ft.com/research/webservices/securities/v1/search?query=${company}&source=${marketsDataKey}`).then((data) => {
    if (data.ok) {
  			return data.json();
  		}
  	}).then((json) => {
		fetch(`http://markets.ft.com/research/webservices/companies/v1/profile?symbols=${json.data.searchResults[0].symbol}&source=${marketsDataKey}`).then((data) => {
      if (data.ok) {
  				return data.json();
  			}
  		}).then((json) => {
			assistant.ask(json.data.items[0].profile.description);
		});
  	}).catch((error) => {
		console.log(error)
	});
  }

  let actionMap = new Map();
  actionMap.set(getCompanyIntent, getCompany);

  assistant.handleRequest(actionMap);
});

if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;

require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
require('isomorphic-fetch');
const Assistant = require('actions-on-google').ApiAiAssistant;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ type: 'application/json' }));
const companyArgument = 'company';
const marketsDataKey = process.env.markets;
const actionMap = new Map();
actionMap.set('getCompany', getCompany);
actionMap.set('more', moreInfo);
const sessionIds = {};
const marketsSecuritiesCache = {};
const marketsProfileCache = {};

function getCompany(assistant) {
  const company = assistant.getArgument(companyArgument);
  new Promise((resolve) => {
    if (marketsSecuritiesCache[company] !== undefined) {
      console.log('Debug: marketsSecuritiesCache hit, company=', company);
      resolve(marketsSecuritiesCache[company]);
    } else {
      console.log('Debug: marketsSecuritiesCache miss, company=', company);
      fetch(`http://markets.ft.com/research/webservices/securities/v1/search?query=${company}&source=${marketsDataKey}`)
      .then((data) => {
        if (data.ok) {
          console.log('Debug: securities data.ok');
          const json = data.json();
          marketsSecuritiesCache[company] = json;
          resolve(json);
        }
      });
    }
  })
  .then((json) => {
    const symbol = json.data.searchResults[0].symbol;
    new Promise((resolve) => {
      if (marketsProfileCache[symbol] !== undefined) {
        console.log('Debug: marketsProfileCache hit, symbol=', symbol);
        resolve(marketsProfileCache[symbol]);
      } else {
        console.log('Debug: marketsProfileCache miss, symbol=', symbol);
        fetch(`http://markets.ft.com/research/webservices/companies/v1/profile?symbols=${symbol}&source=${marketsDataKey}`)
        .then((data) => {
          if (data.ok) {
            console.log('Debug: profile data.ok');
            const json = data.json();
            marketsProfileCache[symbol] = json;
            resolve(json);
          }
        });
      }
    })
    .then((json) => {
      const description = json.data.items[0].profile.description;
      console.log('Debug: responding to assistant with description = ', description);
      assistant.ask(description);
    });
  }).catch((error) => {
    console.log(error);
  })
  ;
}

function getCompanyByName(name) {
  const company = name;
  return new Promise((resolve) => {
    if (marketsSecuritiesCache[company] !== undefined) {
      console.log('Debug: marketsSecuritiesCache hit, company=', company);
      resolve(marketsSecuritiesCache[company]);
    } else {
      console.log('Debug: marketsSecuritiesCache miss, company=', company);
      fetch(`http://markets.ft.com/research/webservices/securities/v1/search?query=${company}&source=${marketsDataKey}`)
      .then((data) => {
        if (data.ok) {
          console.log('Debug: securities data.ok');
          const json = data.json();
          marketsSecuritiesCache[company] = json;
          resolve(json);
        }
      });
    }
  })
  .then((json) => {
    const symbol = json.data.searchResults[0].symbol;
    return new Promise((resolve) => {
      if (marketsProfileCache[symbol] !== undefined) {
        console.log('Debug: marketsProfileCache hit, symbol=', symbol);
        resolve(marketsProfileCache[symbol]);
      } else {
        console.log('Debug: marketsProfileCache miss, symbol=', symbol);
        fetch(`http://markets.ft.com/research/webservices/companies/v1/profile?symbols=${symbol}&source=${marketsDataKey}`)
        .then((data) => {
          if (data.ok) {
            console.log('Debug: profile data.ok');
            const json = data.json();
            marketsProfileCache[symbol] = json;
            resolve(json);
          }
        });
      }
    });
  }).catch((error) => {
    console.log(error);
    return false;
  })
  ;
}

function moreInfo(assistant) {
  console.log('<<< MORE INFO >>>');
  const thisSessionID = assistant.request_.body.sessionId;
  console.log('1 >>>', thisSessionID);
  if (sessionIds[thisSessionID].length === 1) {
    console.log('2 >>>', sessionIds[thisSessionID]);
    assistant.ask('Sorry, you have to ask for a company first.');
  } else {
    console.log('3 >>>', sessionIds[thisSessionID]);
    assistant.ask('Ah, so you want me to tell you more?');
  }
}

app.post('/', (req, res) => {
  const thisSessionID = req.body.sessionId;
  if (sessionIds[thisSessionID] === undefined) {
    sessionIds[thisSessionID] = [req.body];
  } else {
    sessionIds[thisSessionID].push(req.body);
  }
  console.log(sessionIds[thisSessionID], 'Number of calls:', sessionIds[thisSessionID].length);
  console.log('>>>> BODY >>>> \n\n', JSON.stringify(req.body), '\n\n');
  console.log('EXTRACTED_SessionId=', req.body.sessionId);
  console.log('EXTRACTED_conversation_id=', req.body.originalRequest.data.conversation.conversation_id);
  const assistant = new Assistant({ request: req, response: res });
  assistant.handleRequest(actionMap);
});

app.get('/company', (req, res) => {
  getCompanyByName(req.query.companyName)
    .then((value) => {
      console.log('data', value);
      if (value === false) {
        res.status(404);
        res.end();
      } else {
        res.json(value);
      }
    });
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

app.use((req, res) => {
  res.status(500);
  res.end();
});

module.exports = app;

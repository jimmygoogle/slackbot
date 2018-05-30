'use strict';

const { RTMClient } = require('@slack/client');
let rtm = null;
let nlp = null;

//const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
  //console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
  
  // only send deathbot messages to wit
  if(message.text.toLowerCase().includes('deathbot')) {
    nlp.ask(message.text, (err, res) => {
      if(err) {
        console.log(err);
        return;
      }
      
      console.log(res);
      try {
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not get intent");
        }
        
        const intent = require('./intents/' + res.intent[0].value + 'Intent');
        
        intent.processIntent(res, function(err, res) {
          if(err) {
            console.log(err.message);
            return;
          }
          
          // send message
          return rtm.sendMessage(res, message.channel);
        });
      } catch(err) {
        console.log(err);
        return rtm.sendMessage('Sorry, I dont know what you are talking about.', message.channel);
      }     
    });    
  }
}

function addAuthenticatedHandler(rtm, handler) {
  console.log(rtm);
  rtm.on(rtm.hello, handler);
}

module.exports.init = function slackClient (token, logLevel, nlpClient) {
  //The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token);
  nlp = nlpClient;
  rtm.on('message', handleOnMessage);
  return rtm;
};
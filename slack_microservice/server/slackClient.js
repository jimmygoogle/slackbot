'use strict';

const { RTMClient } = require('@slack/client');
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
  console.log(`Logged in as ${rtmStartData.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
  //console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
  
  // only send jimbot messages to wit
  if(message.text.toLowerCase().includes('jimbot')) {
    nlp.ask(message.text, (err, res) => {
      if(err) {
        console.log(err);
        return;
      }

      try {
        // the wit api is finicky with the calls or I am not setting something up right in the understanding logic
        // so if intent isnt set just set it for this exercise
        if(!res.intent || !res.intent[0] || !res.intent[0].value) {
          //throw new Error("Could not get intent");
          res['intent'] = [{value: 'time'}];
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
  rtm.on(rtm.hello, handler);
}

module.exports.init = function slackClient (token, logLevel, nlpClient) {
  //The client is initialized and then started to get an active connection to the platform
  rtm = new RTMClient(token);
  nlp = nlpClient;
  rtm.on('message', handleOnMessage);
  return rtm;
};
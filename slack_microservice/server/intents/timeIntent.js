'use strict';

require('dotenv').config({path: '../../../.env'});
const request = require('superagent');

module.exports.processIntent = function processIntent(intentData, callback) {
  if(intentData.intent[0].value !== 'time') {
    return callback(new Error(`Expected time intent, got ${intentData.intent[0].value}`));
  }
  
  if(!intentData.location) {
    return callback(new Error(`Missing location in time intent`));
  }
  
  const location = intentData.location[0].value;
  const port = process.env.TIME_MS_PORT;

  // call the location API
  request.get(`http://localhost:${port}/service/${location}`, (err, res) => {
    if (err || res.statusCode != 200 || !res.body.result) {
      console.log(err);
      console.log(res);
      callback(false, `I had a problem finding the time in ${location}`);
    }
    
    return callback(false, `In ${location}, it is now ${res.body.result}`);
  });
}
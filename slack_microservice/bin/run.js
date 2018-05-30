'use strict';

require('dotenv').config({path: '../.env'});
const service = require('../server/service');
const http = require('http');
const slackClient = require('../server/slackClient');
require('dotenv').config();
const server = http.createServer(service);

//connect to wit
const witToken = process.env.WIT_TOKEN;
const witClient = require('../server/witClient')(witToken);

// connect to slack
const slackToken = process.env.SLACK_TOKEN;
const slackLogLevel = process.env.SLACK_LOG_LEVEL;
const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

// start the server
server.listen(process.env.SLACK_MS_PORT);
server.on('listening', function() {
  console.log(`Woo hoo!, I am listening on ${server.address().port} in ${service.get('env')} mode.`);
});
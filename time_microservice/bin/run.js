'use strict';

require('dotenv').config({path: '../.env'});
const service = require('../server/service');
const http = require('http');

const server = http.createServer(service);
server.listen(process.env.TIME_MS_PORT);

server.on('listening', function() {
    console.log(`Time microservice is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
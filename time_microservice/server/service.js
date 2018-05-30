'use strict';

require('dotenv').config({path: '../../.env'});
const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + process.env.GOOGLE_GEOLOCATION_API_KEY, (err, res) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

console.log('looking up %s with api key %s', req.params.location, process.env.GOOGLE_GEOLOCATION_API_KEY);
        // lat and long location
        console.log(res.body);
        const location = res.body.results[0].geometry.location;
        const timestamp = +moment().format('X');
        
        req.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + process.env.GOOGLE_TIME_ZONE_API_KEY, (err, res) => {
          if(err) {
            console.log(err);
            return res.sendStatus(500);
          }
          
          const result = res.body;
          const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm::ss a');
          
          res.json({result: timeString});
        
        });
        
    });

});

module.exports = service;
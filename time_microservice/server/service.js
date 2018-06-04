'use strict';

require('dotenv').config({path: '../../.env'});
const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment-timezone');

service.get('/service/:location', (req, res, next) => {

    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location + '&key=' + process.env.GOOGLE_GEOLOCATION_API_KEY, (err, response) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }

        // lat and long location
        //console.log(response.body.results[0].geometry);
        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');
        
        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp + '&key=' + process.env.GOOGLE_TIME_ZONE_API_KEY, (err, response) => {

          if(err) {
            console.log(err);
            return res.sendStatus(500);
          }

          // use the timezone to set the time string
          const result = response.body;
          const timeString = moment().tz(result.timeZoneId).format('dddd, MMMM Do YYYY, h:mm:ss a');
          
          console.log('timestamp is %s, dstOffset is %s, rawOffset is %s, timeString is %s', timestamp, result.dstOffset, result.rawOffset, timeString);
          res.json({result: timeString});    
        });
    });

});

module.exports = service;
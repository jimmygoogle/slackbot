# slackbot

This is a small node.js app that will answer time questions for a location to a specified Slack bot and return the response to the user. It uses Wit to figure out the intent and possible location, then retrieves the time using the Google Geolocation and Time Zone apis.

This is based on a LinkedIn learning (https://www.linkedin.com/learning/node-js-build-your-first-microservice) exercise I followed.

Ex:

Jim [4:43 PM]
jimbot what time is it in costa rica?

jimbot APP [4:43 PM]
In costa rica, it is now Monday, June 4th 2018, 2:43:47 pm



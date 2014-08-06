'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Schedule = require('../schedule/schedule.model');
var controller = require('./twilio.controller');

describe('GET /api/twilio should respond when necessary', function() {

  // since a test requires sending a text, we only enable the test when necessary

  // phone number that will receive texts during successful test
  var testersPhone = '+18027936146';

  // UNCOMMENT BELOW TO TEST
  // Schedule.find({}).remove(function() {
  //     // create
  //     Schedule.create({
  //       days : [1,2,3,4,5],
  //       times : ['00:00'],
  //       publisherPhone: '+15556667777',
  //       publisherName: 'Your Grandma',
  //       subscriberPhone: testersPhone
  //     }, function(err, schedule) {
  //       // test
  //       controller.checkin({query: {From: '+15556667777'}}, null, function() {
  //         // wipe when finished
  //         Schedule.find({}).remove();
  //       });
  //     });
  //   });

});
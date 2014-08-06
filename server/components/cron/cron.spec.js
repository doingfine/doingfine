'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var cron = require('./cron.js');
var Schedule = require('../../api/schedule/schedule.model');

describe('Cron functionality', function() {

  it('should send a checkin reminder text to a nelson\'s phone', function() {

    // texts cost money, use this only when you need to :)
    var dummySchedules = [ {publisherPhone: '+18027936146', subscriberName: 'Nelson Riley' } ];
    // cron.sendCheckins(null, dummySchedules);

  });

  it('should successfully query for checkins scheduled for now', function(done) {

    var now = cron.getDayTime();

    // create a schedule with current time and day of week then find it using cron
    // wipe
    Schedule.find({}).remove(function() {
      // create
      Schedule.create({
        days : [now.day],
        times : [now.time]
      }, function(err, schedule) {
          // created
          schedule.should.be.type('object');
          // query
          cron.checkinsMatchingNow(function(err, schedules) {
            // find
            schedules.should.have.length(1);
          });
        }
      );
    });

    done();
    
  });

});

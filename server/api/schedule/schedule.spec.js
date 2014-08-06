'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = require('../user/user.model');

describe('GET /api/schedules', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/schedules')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});

describe('POST /api/schedules', function() {

  it('should add a schedule and attach it to a user', function(done) {

    var testUser = {name: 'Troy Willows', password: 'dummy', phone: '+18027958866', email: 'me@good.com'};
    var newSched = {days: [1,2,3,4,5,6,7], times: ['09:00', '18:00']};

    var getNew = function(id) {
      request(app)
        .get('/api/schedules/'+id)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          if (JSON.stringify(res.body.days) !== JSON.stringify(newSched.days)) {
            throw new Error('Schedules do not match');
          }
        })
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    };

    // create a user so that we can update their list of schedules when we create a schedule
    var newUser = new User(testUser);
    newUser.save(function(err, user) {
      if (err) return done(err);
      newSched.subscriberID = user._id;
      request(app)
        .post('/api/schedules')
        .send(newSched)
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          getNew(res.body._id);
        });
    });

  });

});

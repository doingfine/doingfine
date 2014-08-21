'use strict';

var Schedule = require('../schedule/schedule.model');
var twilio = require('twilio');
var dfTwilio = require('../../components/df.twilio/df.twilio.js');
var _ = require('lodash');
var User = require('../user/user.model');
var nodemailer = require('nodemailer');

exports.checkin = function(req, res, callback) {
  if (!callback) {
    callback = function() {};
  }
  var senderPhone = req.query.From;
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'doingfineapp@gmail.com',
        pass: 'Doingfine12345'
    }
  });

  var senderPhone = req.query.From;

  Schedule.find({publisherPhone: senderPhone}, function(err, schedules) {
    _.forEach(schedules, function(schedule) {
      if(schedule.subscriberCommunicationType === 'SMS'){
        dfTwilio.sendText(schedule.subscriberPhone, schedule.publisherName + ' just checked in and is doing fine. From DoingFineApp.com.');
      }
      else if(schedule.subscriberCommunicationType === 'Email'){
        //get subscriber email from user.model 
        if(typeof schedule.subscriberEmail === 'undefined'){
          User.findById(schedule.subscriberID, function (err, user) {
            if (err) console.log(err);
            if (!user){
              console.log("user not found");
            }
          }).exec().then(function(u){
            schedule.subscriberEmail = u.email;
            //send email to subscriber
            var toAddress = schedule.subscriberEmail;
            var emailSubject = schedule.publisherName + ' status update';
            var emailText = schedule.publisherName + ' has checked in via DoingFine.';
            var emailHTML = schedule.publisherName + ' has checked in via DoingFine.';
            var mailOptions = {
              from: 'DoingFine <updates@doingfine.com>', // sender address
              to: toAddress,// list of receivers
              subject: emailSubject, // Subject line
              text: emailText, // plaintext body
              html: '<b>' + emailHTML + '</b>' // html body
            };
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error + 'this is the sendMail error');
              }
              else{
                  console.log('Message sent: ' + info.response);
              }
            });
          }, function(err){
            console.log("Promise: " + err);
          });
        }
      }
    });
    callback();
  });

};

exports.checkin = function(req, res, callback) {
  if (!callback) {
    callback = function() {};
  }
  var senderPhone = req.query.From;
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'doingfineapp@gmail.com',
        pass: 'Doingfine12345'
    }
  });

  var senderPhone = req.query.From;

  Schedule.find({publisherPhone: senderPhone}, function(err, schedules) {
    _.forEach(schedules, function(schedule) {
      if(schedule.subscriberCommunicationType === 'SMS'){
        dfTwilio.sendText(schedule.subscriberPhone, schedule.publisherName + ' just checked in and is doing fine. From DoingFineApp.com.');
      }
      else if(schedule.subscriberCommunicationType === 'Email'){
        //get subscriber email from user.model 
        if(typeof schedule.subscriberEmail === 'undefined'){
          User.findById(schedule.subscriberID, function (err, user) {
            if (err) console.log(err);
            if (!user){
              console.log("user not found");
            }
          }).exec().then(function(u){
            schedule.subscriberEmail = u.email;
            //send email to subscriber
            var toAddress = schedule.subscriberEmail;
            var emailSubject = schedule.publisherName + ' status update';
            var emailText = schedule.publisherName + ' has checked in via DoingFine.';
            var emailHTML = schedule.publisherName + ' has checked in via DoingFine.';
            var mailOptions = {
              from: 'DoingFine <updates@doingfine.com>', // sender address
              to: toAddress,// list of receivers
              subject: emailSubject, // Subject line
              text: emailText, // plaintext body
              html: '<b>' + emailHTML + '</b>' // html body
            };
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error + 'this is the sendMail error');
              }
              else{
                  console.log('Message sent: ' + info.response);
              }
            });
          }, function(err){
            console.log("Promise: " + err);
          });
        }
      }
    });
    callback();
  });

};

// Handle post to /api/twilio/twiml
exports.callPost = function(req, res) {
  // form a twiML response (xml) like so:
  var twiml = new twilio.TwimlResponse();
  twiml.gather( {
    action: '/api/twilio'
  }, function(){
    var recordedMessage = 'Hello. If something is wrong, ' +
    ' press the pound key. Otherwise, press 1.';
    this.say(recordedMessage, {
      voice:'alice',
      language:'en-gb'
    });
  });
  res.set('Content-Type', 'text/xml');
  return res.send(200, twiml.toString());
}

function handleError(res, err) {
  return res.send(500, err);
}

exports.recordKeyPress = function(req, res) {
  req.query = {From: null};
  req.query.From = req.body.To;
  exports.checkin(req,res);
  res.send(200);
};

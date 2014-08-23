'use strict';

var _ = require('lodash');
var Mobileuser = require('./mobileuser.model');
var twilio = require('../../components/df.twilio/df.twilio.js');
var mongoose = require('mongoose');
// Get list of mobileusers
exports.index = function(req, res) {
  Mobileuser.find(function (err, mobileusers) {
    if(err) { return handleError(res, err); }
    return res.json(200, mobileusers);
  });
};

// Get a single mobileuser
exports.show = function(req, res) {
  Mobileuser.findById(req.params.id, function (err, mobileuser) {
    if(err) { return handleError(res, err); }
    if(!mobileuser) { return res.send(404); }
    return res.json(mobileuser);
  });
};

// Creates a new mobileuser in the DB.
exports.create = function(req, res) {
  var code = Math.floor(Math.random()*8999 + 1000);
  req.body.code = code;
  req.body.verified = false;
  //logic for handling active users, unverified users, and invited users
  Mobileuser.find({phone: req.body.phone}).exec().then(function(mobileusers){
    if(mobileusers.length === 0){
      if(!req.body.friends){
        Mobileuser.create(req.body, function(err, mobileuser) {
          if(err) { return handleError(res, err); }
          twilio.sendText(req.body.phone, 'DoingFine confirmation code: ' + code);
          return res.json(201, mobileuser);
        });
      } else {
        //get friend that matches id passed in with request
        Mobileuser.findById(req.body.friends[0], function(err, mobileuser){
          if(err) { return handleError(res, err); }
          var inviter = mobileuser;
          Mobileuser.create(req.body, function(err, mobileuser) {
            if(err) { return handleError(res, err); }
            var message = inviter.first + ' ' + inviter.last +
            ' has invited you to join DoingFine. Sign up at ' +
            'doingfine.azurewebsites.net';
            twilio.sendText(req.body.phone, message);
            return res.json(201, mobileuser);
          });
        });
      }
    } else {
      var foundUser = mobileusers[0];
      if(!req.body.friends){
        if(!foundUser.verified){
          twilio.sendText(req.body.phone, 'DoingFine confirmation code: ' + code);
          updateById(foundUser._id, req, res);
        } else {
          if(foundUser.first === req.body.first && foundUser.last === req.body.last){
            _.merge(foundUser, req.body);
            foundUser.save(function(err){
              if (err) { return handleError(res, err); }
              twilio.sendText(req.body.phone, 'DoingFine confirmation code: ' + code);
              return res.send(200, 'Idfv updated. Sending Confirmation code.');
            });
          } else {
            return res.send(403, 'Phone Number already exists');
          }
        }
      } else {
        return res.send(403, 'Friend already exists');
      }
    }
  });
};

// Updates an existing mobileuser in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  updateById(req.params.id, req, res);
};

// Deletes a mobileuser from the DB.
exports.destroy = function(req, res) {
  Mobileuser.findById(req.params.id, function (err, mobileuser) {
    if(err) { return handleError(res, err); }
    if(!mobileuser) { return res.send(404); }
    mobileuser.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Sets user as valid if request contains correct confirmation code 
exports.verify = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mobileuser.findById(req.params.id, function (err, mobileuser) {
    if (err) { return handleError(res, err); }
    if(!mobileuser) { return res.send(404); }
    if(req.body.code === mobileuser.code){
      var updated = _.merge(mobileuser, {verified: true});
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, mobileuser);
      });
    } else {
      res.send(401, mobileuser);
    }
  });
};

// Responds with array of user objects who are friends of url-specified user
exports.getFriends = function(req, res) {
  Mobileuser.findById(req.params.id, function(err, mobileuser) {
    var friends = mobileuser.friends.slice();
    // cast to ObjectId for mongoose query
    friends.map(function(element){
      return mongoose.Types.ObjectId(element);
    });
    Mobileuser.find({_id: {$in: friends}}, function(err, foundFriends){
      if (err) { return handleError(res, err); }
      if (!foundFriends) {return res.send(404);}
      return res.json(200, foundFriends);
    });
  });
};

// Append friends to url-specified user's list of friends
exports.addFriends = function(req, res) {
  Mobileuser.findById(req.params.id, function(err, mobileuser) {
    mobileuser.friends = mobileuser.friends.concat(req.body.friends);
    if (err) { return handleError(res, err); }
    if(!mobileuser) { return res.send(404); }
    mobileuser.save(function (err, data) {
      if (err) { return handleError(res, err); }
      return res.json(200, data);
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
function updateById(id, req, res){
  Mobileuser.findById(id, function (err, mobileuser) {
    if (err) { return handleError(res, err); }
    if(!mobileuser) { return res.send(404); }
    var updated = _.merge(mobileuser, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, mobileuser);
    });
  });
};

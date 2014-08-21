'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MobileuserSchema = new Schema({
  phone: String,
  idfv: String,
  first: String,
  last: String,
  verified: Boolean,
  code: String,
  friends: {type: [String], default: []}
});

module.exports = mongoose.model('Mobileuser', MobileuserSchema);

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MobileuserSchema = new Schema({
  name: String,
  udid: String,
  phone: String,
  verified: Boolean,
  code: String
});

module.exports = mongoose.model('Mobileuser', MobileuserSchema);

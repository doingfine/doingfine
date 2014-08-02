'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  days: [Number],
  times: [String],
  active: Boolean
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
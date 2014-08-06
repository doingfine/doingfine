'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  days: [Number],
  times: [String],
  publisherPhone: String,
  publisherName: String,
  subscriberPhone: String,
  subscriberName: String,
  subscriberID: String
});

ScheduleSchema.path('days')
  .validate(function(days){
    return days.length
  }, 'One day a week must be selected');

ScheduleSchema.path('times')
  .validate(function(times){
    return times.length
  }, 'One time must be selected');

ScheduleSchema.path('subscriberPhone')
  .validate(function(phone){
    return phone.length === 12
  }, 'Phone number should have 12 digits');

ScheduleSchema.path('subscriberPhone')
  .validate(function(phone){
    return phone[0] === '+'
  }, 'Phone number should start with +');

ScheduleSchema.path('subscriberPhone')
  .validate(function(phone){
    return phone[1] === '1'
  }, 'First number in phone number should be 1');

module.exports = mongoose.model('Schedule', ScheduleSchema);

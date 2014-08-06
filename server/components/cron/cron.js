var cron = require('cron');
var Schedule = require('../../api/schedule/schedule.model');
var twilio = require('./../df.twilio/df.twilio.js');
var moment = require('moment');
var _ = require('lodash');
moment().format();

// get Day as 0-6 and Time as '13:15' for Now (used to search schedules, then send checkins)
var getDayTime = module.exports.getDayTime = function() {
  var date = {};
  var now = moment().utc().zone('-07:00');
  var hour = now.hour().toString();
  if (hour.length === 1) {
    hour = '0' + hour;
  }
  var minute = now.minute().toString();
  if (minute.length === 1) {
    minute = '0' + minute;
  }
  date.day = now.day();
  date.time = hour + ':' + minute;
  return date;
};

// send checkin updates to subscriber of each schedule passed in
var sendCheckins = module.exports.sendCheckins = function(err, schedules) {
  if(err) { throw err; };
  var message = ' wants to know you are OK. Please check in by replying with any text message.';
  _.forEach(schedules, function(schedule) {
    twilio.sendText(schedule.publisherPhone, schedule.subscriberName + message);
  });
};

// find all checkins scheduled for now
var checkinsMatchingNow = module.exports.checkinsMatchingNow = function(cb) {
  var now = getDayTime();
  // find all schedules with current day and time
  var query = {
    times: { $in: [now.time] },
    days: { $in: [now.day] }
  };
  Schedule.find(query, cb);
};

// kick off cron jobs
module.exports.start = function() {
  var CronJob = cron.CronJob;
  // run every minute
  new CronJob('00 */1 * * * *', function(){
    // reveal server timezone
    console.log(moment.utc().zone('-07:00').format());
    checkinsMatchingNow(sendCheckins);
  }, null, true, 'America/Los_Angeles');
};


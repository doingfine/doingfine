var cron = require('cron');
var Schedule = require('../api/schedule/schedule.model');

module.exports.start = function() {
	var cronJob = require('cron').CronJob;
	new cronJob('00 */1 * * * *', function(){
	  Schedule.find(function (err, schedules) {
	    if(err) { throw err; }
	    console.log("Schedules: ", schedules);
	  });
	}, null, true, "America/Los_Angeles");
};
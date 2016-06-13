
/**
 * Module dependencies.
 */

var CronJob = require('cron').CronJob;
var bot = require('./lib/bot');
var co = require('co');

/**
 * Initiate Cronjob.
 */

new CronJob({
  cronTime: "0 0 * * *", // once a day at midnight
  onTick: co(bot()),
  start: true,
  timeZone: "America/Los_Angeles"
});

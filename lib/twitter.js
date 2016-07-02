
/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var Twitter = require('twitter');
var config = require('./config');

/**
 * Twitter credentials
 */

var twitterConfig = {
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
};

/**
 * Define `client`.
 */

var client = new Twitter(twitterConfig);

/**
 * Get friendship status thunk.
 */

exports.getTweets = function() {
  return function(fn) {
    client.get('statuses/user_timeline', { user_id: config.user_id, count: 200, exclude_replies: true, include_rts: false }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      fn(null, { data: data, res: res });
    });
  };
};

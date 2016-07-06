
/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var Twitter = require('twitter');
var config = require('dotenv').config();
var _ = require('lodash');

/**
 * Twitter credentials
 */

var twitterConfig = {
  consumer_key: config.TWITTER_CONSUMER_KEY,
  consumer_secret: config.TWITTER_CONSUMER_SECRET,
  access_token_key: config.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: config.TWITTER_ACCESS_TOKEN_SECRET
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
    client.get('statuses/user_timeline', { user_id: config.TWITTER_USER_ID, count: 200, exclude_replies: true, include_rts: false }, function(err, data, res) {
      if (err) fn(err, null);
      if (res.headers['x-rate-limit-remaining'] < 1) fn([{ code: 88, message: 'About to exceed rate limit' }], null);
      var data = _.filter(data, function(d) {
        return d.entities.urls.length === 0;
      });
      fn(null, { data: data, res: res });
    });
  };
};


/**
 * Module dependencies.
 */

var Tweet = require('./db-tweet');
var twitter = require('./twitter');
var github = require('./github');
var _ = require('lodash');

/**
 * Main bot.
 */

module.exports = function *() {
  var res = yield twitter.getTweets();

  // var tweets = _.map(res.data, function(t) {
  //   return {
  //     id: t.id_str,
  //     text: t.text,
  //     created_at: t.created_at
  //   };
  // });

  // DB access.
  // var oldTweets = yield Tweet.find({}, { sort: { created_at: -1 }});
  // for (var i = 0; i < newTweets.length; i++) {
  //   yield Tweet.insert(newTweets[i]);
  // }

  // yield github.writeTweets(tweets);
};

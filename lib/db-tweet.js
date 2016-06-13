
/**
 * Module dependencies.
 */

var wrap = require('co-monk');
var db = require('./db');;
var Tweet = wrap(db.get('tweet'));

/**
 * Expose `Tweet`.
 */

module.exports = Tweet;

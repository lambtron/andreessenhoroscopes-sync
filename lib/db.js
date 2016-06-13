
/**
 * Module dependencies.
 */

var mongo = process.env.MONGODB_URI || 'mongodb://localhost/andreessenhoroscopes';
var monk = require('monk');

/**
 * Expose `db`.
 */

module.exports = monk(mongo);

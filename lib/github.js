
/**
 * Module dependencies.
 */

var request = require('superagent');
var GitHubApi = require('github');
var config = require('dotenv').config();

/**
 * Define `client`.
 */

var github = new GitHubApi({
  debug: true,
  protocol: "https",
  host: "api.github.com",
  timeout: 5000,
  headers: {
    "user-agent": "andreessenhoroscopes"
  },
  followRedirects: false,
  includePreview: true
});

/**
 * Authenticate github.
 */

github.authenticate({
  type: 'oauth',
  token: config.GITHUB_TOKEN
});

/**
 * Write tweets thunk.
 */

exports.writeTweets = function(tweets) {
  return function(fn) {
    var content = new Buffer(updateHoroscopes(tweets)).toString('base64');
    getSHA(function(err, res) {
      if (err) fn(err, null);
      github.repos.updateFile({ user: 'lambtron', repo: 'andreessenhoroscopes', path: 'horoscopes.yml', content: content, message: 'Added new horoscope', sha: res }, function(err, res) {
        if (err) fn(err, null);
        fn(null, res);
      });
    });
  };
};

/**
 * Helper function to get SHA of horoscopes.yml.
 */

function getSHA(fn) {
  var path = 'horoscopes.yml';
  request
    .get('https://api.github.com/repos/lambtron/andreessenhoroscopes/git/trees/master')
    .end(function(err, res) {
      if (err) fn(err, null);
      for (var i = 0; i < res.body.tree.length; i++) {
        if (res.body.tree[i].path === path) fn(null, res.body.tree[i].sha);
      }
    });
}

/**
 * Helper function to prepend tweet to horoscopes.yml.
 */

function updateHoroscopes(tweets) {
  // github.repos.getContent({ user: 'lambtron', repo: 'andreessenhoroscopes', path: 'horoscopes.yml' }, function(err, res) {
    // if (err) fn(err, null);
    // var oldHoroscopes = new Buffer(res.content, 'base64').toString('utf-8');
    var newHoroscopes = '';
    for (var i = 0; i < tweets.length; i++) {
      newHoroscopes = newHoroscopes +
        '-\n' +
        '    tweet_id: \'' + tweets[i].id + '\'\n' +
        '    content: \'' + smartquotes(tweets[i].text) + '\'\n';
    }
    return newHoroscopes; // + oldHoroscopes;
  // });
}

/**
 * Helper function to parse to smart quotes.
 */

function smartquotes(str) {
  return str
    .replace(/'''/g, '\u2034')                                                   // triple prime
    .replace(/(\W|^)"(\S)/g, '$1\u201c$2')                                       // beginning "
    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2')          // ending "
    .replace(/([^0-9])"/g,'$1\u201d')                                            // remaining " at end of word
    .replace(/''/g, '\u2033')                                                    // double prime
    .replace(/(\W|^)'(\S)/g, '$1\u2018$2')                                       // beginning '
    .replace(/([a-z])'([a-z])/ig, '$1\u2019$2')                                  // conjunction's possession
    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3')                 // ending '
    .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3')     // abbrev. years like '93
    .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
    .replace(/'/g, '\u2032');
}

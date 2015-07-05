var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   auth: !google.auth.JWT,
 *   id: string
 * }} options
 * @return {!Promise}
 */
function get (options) {
  return new Promise(function (resolve, reject) {
    google.drive('v2').changes.get({
      auth: options.auth,
      changeId: options.id
    }, function (error, response) {
      error ? reject(error) : resolve(response);
    });
  });
}

/**
 * @param {{
 *   address: string,
 *   auth: !google.auth.JWT,
 *   channelId: string
 * }}
 * @return {!Promise}
 */
function watch (options) {
  var ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
  return new Promise(function (resolve, reject) {
    google.drive('v2').changes.watch({
      auth: options.auth,
      resource: {
        address: options.address,
        expiration: Date.now() + ONE_WEEK,
        id: options.channelId,
        type: 'web_hook'
      }
    }, function (error, response) {
      error ? reject(error) : resolve(response);
    });
  });
}

module.exports = {
  get: get,
  watch: watch
};

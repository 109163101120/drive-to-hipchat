var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   auth: !google.auth.JWT,
 *   id: string,
 *   resourceId: string
 * }}
 * @return {!Promise}
 */
function stop (options) {
  return new Promise(function (resolve, reject) {
    google.drive('v2').channels.stop({
      auth: options.auth,
      resource: {
        id: options.id,
        resourceId: options.resourceId
      }
    }, function (error, response) {
      error ? reject(error) : resolve();
    });
  });
}

module.exports = {
  stop: stop
};

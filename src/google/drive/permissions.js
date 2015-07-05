var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   auth: !google.auth.JWT,
 *   fileId: string
 * }}
 * @return {!Promise}
 */
function list (options) {
  return new Promise(function (resolve, reject) {
    google.drive('v2').permissions.list({
      auth: options.auth,
      fileId: options.fileId
    }, function (error, response) {
      error ? reject(error) : resolve(response);
    });
  });
}

module.exports = {
  list: list
};

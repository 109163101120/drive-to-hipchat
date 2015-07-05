var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   auth: !google.auth.JWT,
 *   pageToken: (string|undefined),
 *   q: (string|undefined)
 * }} options
 * @return {!Promise<!Array<!Object>>}
 */
function list (options) {
  return new Promise(function (resolve, reject) {
    google.drive('v2').files.list({
      auth: options.auth,
      corpus: 'DEFAULT',
      maxResults: 1000,
    }, function (error, response) {
      if (error) {
        reject(error);
      } else if (response.nextPageToken) {
        list({
          auth: options.auth,
          pageToken: response.nextPageToken,
          q: options.q
        }).then(function (files) {
          resolve([].concat(response.items, files));
        }).catch(reject);
      } else {
        resolve(response.items);
      }
    });
  });
}

module.exports = {
  list: list
};

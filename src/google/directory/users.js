var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   auth: !google.auth.JWT,
 *   domain: string,
 *   pageToken: (string|undefined)
 * }} options
 * @return {!Promise<!Array<!Object>>}
 */
function list (options) {
  return new Promise(function (resolve, reject) {
    google.admin('directory_v1').users.list({
      auth: options.auth,
      domain: options.domain,
      maxResults: 500,
      pageToken: options.pageToken
    }, function (error, response) {
      if (error) {
        reject(error);
      } else if (response.nextPageToken) {
        list({
          auth: options.auth,
          domain: options.domain,
          pageToken: response.nextPageToken
        }).then(function (users) {
          resolve([].concat(response.users, users));
        }).catch(reject);
      } else {
        resolve(response.users);
      }
    });
  });
}

module.exports = {
  list: list
};

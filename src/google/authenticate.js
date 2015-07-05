var google = require('googleapis'),
    Promise = require('bluebird');

/**
 * @param {{
 *   email: string,
 *   scopes: (!Array<string>|string),
 *   serviceAccount: {{
 *     email: string,
 *     privateKey: string
 *   }}
 * }} options
 * @return {!Promise<!google.auth.JWT>}
 */
function authenticate (options) {
  return new Promise(function (resolve, reject) {
    var client;

    client = new google.auth.JWT(
      options.serviceAccount.email,
      undefined,
      options.serviceAccount.privateKey,
      options.scopes,
      options.email
    );

    client.authorize(function (error, tokens) {
      error ? reject(error) : resolve(client);
    });
  });
}

module.exports = authenticate;

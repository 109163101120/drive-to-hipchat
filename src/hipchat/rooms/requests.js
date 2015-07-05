var Promise = require('bluebird'),
    request = require('request');

/**
 * @param {{
 *   url: string,
 *   token: string
 * }} options
 * @return {!Promise}
 */
function get (options) {
  return new Promise(function (resolve, reject) {
    request.get({
      headers: {
        'Authorization': 'Bearer ' + options.token
      },
      url: options.url
    }, function (error, response) {
      if (error) {
        reject(error)
      } else if (response.body) {
        resolve(JSON.parse(response.body));
      } else {
        resolve();
      }
    });
  });
}

/**
 * @param {{
 *   body: !Object,
 *   token: string,
 *   url: string
 * }} options
 * @return {!Promise}
 */
function post (options) {
  return new Promise(function (resolve, reject) {
    request.post({
      body: JSON.stringify(options.body),
      headers: {
        'Authorization': 'Bearer ' + options.token,
        'Content-Type': 'application/json'
      },
      url: options.url
    }, function (error, response) {
      if (error) {
        reject(error)
      } else if (response.body) {
        resolve(JSON.parse(response.body));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  get: get,
  post: post
};

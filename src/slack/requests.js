var Promise = require('bluebird'),
    request = require('request');

/**
 * @param {!Object} options
 * @return {!Promise}
 */
function post (options) {
  return new Promise(function (resolve, reject) {
    request.post(options, function (error, response) {
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
  post: post
};

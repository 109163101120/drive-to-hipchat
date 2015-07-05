var API_BASE_URL = 'https://api.hipchat.com/v2',
    requests = require('./requests');

/**
 * @param {{
 *   event: string,
 *   roomId: number,
 *   token: string,
 *   url: string
 * }} options
 * @return {!Promise}
 */
function create (options) {
  return requests.post({
    body: {
      event: options.event,
      url: options.url
    },
    token: options.token,
    url: API_BASE_URL + '/room/' + options.roomId + '/webhook'
  });
}

/**
 * @param {{
 *   roomId: number,
 *   token: string
 * }} options
 * @return {!Promise}
 */
function list (options) {
  return requests.get({
    url: API_BASE_URL + '/room/' + options.roomId + '/webhook',
    token: options.token
  });
}

module.exports = {
  create: create,
  list: list
};

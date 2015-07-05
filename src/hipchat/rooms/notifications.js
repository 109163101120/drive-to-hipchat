var requests = require('./requests');

/**
 * @param {{
 *   color: string,
 *   message: string,
 *   messageFormat: string,
 *   notify: boolean,
 *   token: string,
 *   roomId: number
 * }} options
 * @return {!Promise}
 */
function send (options) {
  return requests.post({
    body: {
      color: options.color,
      message: options.message,
      message_format: options.messageFormat,
      notify: options.notify
    },
    token: options.token,
    url: 'https://api.hipchat.com/v2/room/' + options.roomId + '/notification'
  });
}

module.exports = {
  send: send
};

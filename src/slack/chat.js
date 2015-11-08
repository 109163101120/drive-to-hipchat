var requests = require('./requests');

/**
 * @param {{
 *   attachments: (!Object|undefined),
 *   channel: string,
 *   text: (string|undefined),
 *   token: string,
 *   username: string
 * }} options
 * @return {!Promise}
 */
function postMessage (options) {
  return requests.post({
    form: {
      attachments: options.attachments && JSON.stringify(options.attachments),
      channel: options.channel,
      text: options.text,
      token: options.token,
      username: options.username
    },
    url: 'https://slack.com/api/chat.postMessage'
  });
}

module.exports = {
  postMessage: postMessage
};

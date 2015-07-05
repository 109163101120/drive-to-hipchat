var configuration = require('./configuration'),
    hipchat = require('./hipchat');

/**
 * @return {!Promise<boolean>}
 */
function getWebhookExists () {
  return hipchat.rooms.webhooks.list({
    roomId: configuration.HIPCHAT_ROOM_ID,
    token: configuration.HIPCHAT_ROOM_ADMIN_TOKEN
  }).then(function (webhooks) {
    return webhooks.items.some(function (webhook) {
      return webhook.url === configuration.PING_URL;
    });
  });
}

/**
 * @return {!Promise}
 */
function refresh () {
  getWebhookExists().then(function (webhookExists) {
    if (!webhookExists) {
      hipchat.rooms.webhooks.create({
        event: 'room_enter',
        roomId: configuration.HIPCHAT_ROOM_ID,
        token: configuration.HIPCHAT_ROOM_ADMIN_TOKEN,
        url: configuration.PING_URL
      });
    }
  });
}

module.exports = {
  refresh: refresh
};

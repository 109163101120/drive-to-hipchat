var configuration = require('./configuration'),
    db = require('./db'),
    google = require('./google'),
    Promise = require('bluebird'),
    uuid = require('node-uuid');

/**
 * @param {string} email
 * @return {!Promise<!google.auth.JWT>}
 */
function authenticate (email) {
  return google.authenticate({
    email: email,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    serviceAccount: {
      email: configuration.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: configuration.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    }
  });
}

/**
 * @param {!Object} user
 * @return {!Promise}
 */
function createChannel (user) {
  console.log('Creating channel for ' + user.email);
  return watchChanges()
      .then(storeChannel);

  /**
   * @param {!Object} watchResponse
   * @return {!Promise}
   */
  function storeChannel (watchResponse) {
    return db.channels.create({
      expires: watchResponse.expiration,
      id: watchResponse.id,
      resourceId: watchResponse.resourceId,
      userId: user.id
    });
  }

  /**
   * @return {!Promise<!Object>}
   */
  function watchChanges () {
    return authenticate(user.email).then(function (auth) {
      return google.drive.changes.watch({
        address: configuration.NOTIFICATION_URL,
        auth: auth,
        channelId: uuid.v4()
      });
    });
  }
}

/**
 * @return {!Promise}
 */
function createNewChannels () {
  return db.users.listWithoutChannel()
      .map(createChannel);
}

/**
 * @param {!Object} channel
 * @return {!Promise}
 */
function recreateChannel (channel) {
  return db.users.get(channel.user_id).then(function (user) {
    console.log('Recreating channel for ' + user.email);
    return createChannel(user)
        .then(removeChannel.bind(null, channel, user));
  });
}

/**
 * @return {!Promise}
 */
function recreateExpiringChannels () {
  var ONE_DAY = 1000 * 60 * 60 * 24;
  return db.channels.listExpiringIn(ONE_DAY)
      .map(recreateChannel);
}

/**
 * @param {!Object} channel
 * @param {!Object} user
 * @return {!Promise}
 */
function removeChannel (channel, user) {
  return stopChannel()
      .catch()
      .then(dropChannel);

  /**
   * @return {!Promise}
   */
  function dropChannel () {
    return db.channels.remove([channel.id]);
  }

  /**
   * @return {!Promise}
   */
  function stopChannel () {
    return authenticate(user.email).then(function (auth) {
      return google.drive.channels.stop({
        auth: auth,
        id: channel.id,
        resourceId: channel.resource_id
      });
    });
  }
}

/**
 * @return {!Promise}
 */
function refresh () {
  return db.channels.removeDangling()
      .then(recreateExpiringChannels)
      .then(createNewChannels);
}

module.exports = {
  refresh: refresh
};

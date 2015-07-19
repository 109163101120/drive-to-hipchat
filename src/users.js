var configuration = require('./configuration'),
    db = require('./db'),
    google = require('./google'),
    Promise = require('bluebird');

/**
 * @return {!Promise<!google.auth.JWT>}
 */
function authenticate () {
  return google.authenticate({
    email: configuration.GOOGLE_ADMIN_EMAIL,
    scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    serviceAccount: {
      email: configuration.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: configuration.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    }
  });
}

/**
 * @param {!Array<!Object>} localUsers
 * @param {!Array<!Object>} remoteUsers
 * @return {!Promise}
 */
function createUsers (localUsers, remoteUsers) {
  var newUsers = remoteUsers.filter(notPresentLocally);
  return Promise.all(newUsers.map(createUser));

  /**
   * @param {!Object} remoteUser
   * @return {!Promise}
   */
  function createUser (remoteUser) {
    return db.users.create({
      email: remoteUser.primaryEmail,
      id: remoteUser.id
    });
  }

  /**
   * @param {!Object}
   * @return {boolean}
   */
  function notPresentLocally (remoteUser) {
    return !localUsers.some(function (localUser) {
      return localUser.id === remoteUser.id;
    });
  }
}

/**
 * @return {!Promise<number>}
 */
function getTimeSinceLastSync () {
  return db.about.getLastUserSync().then(function (lastSync) {
    return Date.now() - lastSync;
  });
}

/**
 * @return {!Promise<!Array<!Object>>}
 */
function listLocalUsers () {
  return db.users.list();
}

/**
 * @return {!Promise<!Array<!Object>>}
 */
function listRemoteUsers () {
  return authenticate().then(function (auth) {
    return google.directory.users.list({
      auth: auth,
      domain: configuration.GOOGLE_DOMAIN
    });
  });
}

/**
 * @return {!Promise}
 */
function maybeSync () {
  var ONE_DAY = 1000 * 60 * 60 * 24;
  return getTimeSinceLastSync().then(function (timeSinceLastSync) {
    if (timeSinceLastSync >= ONE_DAY) {
      return sync();
    }
  });
}

/**
 * @param {!Array<!Object>} localUsers
 * @param {!Array<!Object>} remoteUsers
 * @return {!Promise}
 */
function removeUsers (localUsers, remoteUsers) {
  var removedUsers = localUsers.filter(notPresentRemotely);
  return db.users.remove(removedUsers.map(getId));

  /**
   * @param {!Object}
   * @return {string}
   */
  function getId (localUser) {
    return localUser.id;
  }

  /**
   * @param {!Object}
   * @return {boolean}
   */
  function notPresentRemotely (localUser) {
    return !remoteUsers.some(function (remoteUser) {
      return remoteUser.id === localUser.id;
    });
  }
}

/**
 * @return {!Promise}
 */
function sync () {
  return Promise.all([
    db.about.touchLastUserSync(),
    listLocalUsers(),
    listRemoteUsers()
  ]).spread(function (_, localUsers, remoteUsers) {
    return Promise.all([
      createUsers(localUsers, remoteUsers),
      removeUsers(localUsers, remoteUsers)
    ]);
  });
}

module.exports = {
  maybeSync: maybeSync
};

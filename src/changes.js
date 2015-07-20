var configuration = require('./configuration'),
    db = require('./db'),
    google = require('./google'),
    hipchat = require('./hipchat'),
    mustache = require('mustache');

/**
 * @param {string} channelId
 * @return {!Promise<!google.auth.JWT>}
 */
function authenticate (channelId) {
  return db.users.getWithChannel(channelId).then(function (user) {
    return google.authenticate({
      email: user.email,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      serviceAccount: {
        email: configuration.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        privateKey: configuration.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
      }
    });
  });
}

/**
 * @param {!google.auth.JWT} auth
 * @param {string} id
 * @return {!Promise<!Object>}
 */
function getChange (auth, id) {
  return google.drive.changes.get({
    auth: auth,
    id: id
  }).catch(function () {
    // ids are off by one for new files
    return google.drive.changes.get({
      auth: auth,
      id: String(parseInt(id, 10) - 1)
    });
  });
}

/**
 * @param {!google.auth.JWT} auth
 * @param {string} id
 * @return {!Promise<!Array<!Object>>}
 */
function getFilePermissions (auth, id) {
  return google.drive.permissions.list({
    auth: auth,
    fileId: id
  });
}

/**
 * @param {!Object} change
 * @param {string} channelId
 */
function handleChange (change, channelId) {
  console.log('Handling change ' + change.id + ' for channel ' + channelId);
  authenticate(channelId).then(function (auth) {
    getChange(auth, change.id).then(function (change) {
      getFilePermissions(auth, change.file.id).then(function (permissions) {
        handleFileChange(change.file, permissions.items);
      });
    });
  });
}

/**
 * @param {!Object} file
 * @param {!Array<!Object>} permissions
 */
function handleFileChange (file, permissions) {
  if (!isPublic()) {
    db.files.setPublic(file.id, false);
  } else {
    db.files.isPublic(file.id)
        .tap(makePublic)
        .then(maybeSendHipChatNotification);
  }

  /**
   * @param {!Object} permission
   * @param {boolean}
   */
  function isDomainPublic (permission) {
    return permission.type === 'domain' && !permission.withLink;
  }

  /**
   * @param {!Object} permission
   * @return {boolean}
   */
  function isGloballyPublic (permission) {
    return permission.type === 'anyone' && !permission.withLink;
  }

  /**
   * @return {boolean}
   */
  function isPublic () {
    return permissions.some(function (permission) {
      return isGloballyPublic(permission)
          || isDomainPublic(permission);
    });
  }

  /**
   * @return {!Promise}
   */
  function makePublic () {
    return db.files.setPublic(file.id, true);
  }

  /**
   * @param {boolean|undefined} wasPublic
   */
  function maybeSendHipChatNotification (wasPublic) {
    var isNew = file.createdDate === file.modifiedDate && wasPublic === undefined,
        wasShared = wasPublic === false;

    if (isNew || wasShared) {
      console.log('Sending HipChat notification');
      console.log('isNew: ' + isNew);
      console.log('wasShared: ' + wasShared);
      console.log(JSON.stringify(file, null, 2));
      console.log(JSON.stringify(permissions, null, 2));

      hipchat.rooms.notifications.send({
        color: 'yellow',
        message: makeHipChatMessage(file),
        messageFormat: 'html',
        notify: true,
        token: configuration.HIPCHAT_NOTIFICATION_TOKEN,
        roomId: configuration.HIPCHAT_ROOM_ID
      });
    }
  }
}

/**
 * @param {!Object} file
 * @return {string}
 */
function makeHipChatMessage (file) {
  var template;

  template = [
    '<img src="{{ iconUrl }}">',
    '<a href="{{ documentUrl }}">{{ documentTitle }}</a>',
    'by {{ ownerName }}'
  ].join(' ');

  return mustache.render(template, {
    documentTitle: file.title,
    documentUrl: file.alternateLink,
    iconUrl: file.iconLink,
    ownerName: file.ownerNames[0]
  });
}

module.exports = {
  handleChange: handleChange
};

var db = require('./db');

/**
 * @return {!Promise}
 */
function ensureInitialised () {
  return db.query('SELECT * FROM about;').then(function (rows) {
    if (rows.length < 1) {
      return db.query('INSERT INTO about (last_user_sync) VALUES (0);');
    }
  });
}

/**
 * @return {!Promise<number>}
 */
function getLastUserSync () {
  return db.query('SELECT last_user_sync FROM about;').then(function (rows) {
    return rows.length ? rows[0].last_user_sync : 0;
  });
}

/**
 * @return {!Promise}
 */
function touchLastUserSync () {
  return ensureInitialised().then(function () {
    return db.query(
      'UPDATE about SET last_user_sync = $1',
      [Date.now()]
    );
  });
}

module.exports = {
  getLastUserSync: getLastUserSync,
  touchLastUserSync: touchLastUserSync
};

var db = require('./db');

/**
 * @param {{
 *   expires: number,
 *   id: string,
 *   resourceId: string,
 *   userId: string
 * }} attributes
 * @return {!Promise}
 */
function create (attributes) {
  return db.query(
    'INSERT INTO channels (expires, id, resource_id, user_id) VALUES ($1, $2, $3, $4);',
    [attributes.expires, attributes.id, attributes.resourceId, attributes.userId]
  );
}

/**
 * @return {!Promise<!Array<!Object>>}
 */
function list () {
  return db.query('SELECT * FROM channels;');
}

/**
 * @param {number} duration
 * @return {!Promise<!Array<!Object>>}
 */
function listExpiringIn (duration) {
  return db.query(
    'SELECT * FROM channels WHERE expires - $1 <= $2',
    [Date.now(), duration]
  )
}

/**
 * @param {!Array<string>} ids
 * @return {!Promise}
 */
function remove (ids) {
  var parameters;

  if (ids.length < 1) {
    return Promise.resolve();
  }

  parameters = ids.map(function (id, index) {
    return '$' + (index + 1);
  });

  return db.query(
    'DELETE FROM channels WHERE id IN (' + parameters + ');',
    ids
  );
}

/**
 * @return {!Promise}
 */
function removeDangling () {
  return db.query([
    'DELETE FROM channels',
    'WHERE id IN (',
      'SELECT channels.id',
      'FROM channels LEFT JOIN users',
      'ON channels.user_id = users.id',
      'WHERE users.id IS NULL',
    ')'
  ].join(' '));
}

module.exports = {
  create: create,
  list: list,
  listExpiringIn: listExpiringIn,
  remove: remove,
  removeDangling: removeDangling
};

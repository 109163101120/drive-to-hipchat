var db = require('./db');

/**
 * @param {{
 *   email: string,
 *   id: string
 * }} attributes
 * @return {!Promise}
 */
function create (attributes) {
  return db.query(
    'INSERT INTO users (id, email) VALUES ($1, $2);',
    [attributes.id, attributes.email]
  );
}

/**
 * @param {string} id
 * @return {!Promise<!Object>}
 */
function get (id) {
  return db.query(
    'SELECT * FROM users WHERE id = $1;',
    [id]
  ).get(0);
}

/**
 * @param {string} channelId
 * @return {!Promise<!Object|undefined>}
 */
function getWithChannel (channelId) {
  var query;

  query = [
    'SELECT users.*',
    'FROM users INNER JOIN channels',
    'ON users.id = channels.user_id',
    'WHERE channels.id = $1;'
  ].join(' ');

  return db.query(query, [channelId]).get(0);
}

/**
 * @return {!Promise<!Array<!Object>>}
 */
function list () {
  return db.query('SELECT * FROM users;');
}

/**
 * @return {!Promise<!Array<!Object>>}
 */
function listWithoutChannel () {
  return db.query([
    'SELECT users.*',
    'FROM users LEFT JOIN channels',
    'ON users.id = channels.user_id',
    'WHERE channels.id IS NULL'
  ].join(' '));
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
    'DELETE FROM users WHERE id IN (' + parameters + ');',
    ids
  );
}

module.exports = {
  create: create,
  get: get,
  getWithChannel: getWithChannel,
  list: list,
  listWithoutChannel: listWithoutChannel,
  remove: remove
};

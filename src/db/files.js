var db = require('./db');

/**
 * @param {string} id
 * @return {!Promise<boolean|undefined>}
 */
function isPublic (id) {
  return db.query(
    'SELECT * FROM files WHERE id = $1;',
    [id]
  ).then(function (rows) {
    if (rows.length > 0) {
      return rows[0].public;
    }
  });
}

/**
 * @param {string} id
 * @param {boolean} publik
 * @return {!Promise}
 */
function setPublic (id, publik) {
  return db.query(
    'SELECT * FROM files WHERE id = $1;',
    [id]
  ).then(function (rows) {
    if (rows.length) {
      return db.query(
        'UPDATE files SET public = $1 WHERE id = $2;',
        [publik, id]
      );
    } else {
      return db.query(
        'INSERT INTO files (id, public) VALUES ($1, $2);',
        [id, publik]
      );
    }
  });
}

module.exports = {
  isPublic: isPublic,
  setPublic: setPublic
};

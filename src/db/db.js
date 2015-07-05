var configuration = require('../configuration'),
    pg = require('pg'),
    Promise = require('bluebird');

Promise.promisifyAll(pg);

/**
 * @return {!Promise<!Array>}
 */
function connect () {
  return pg.connectAsync(configuration.DATABASE_URL);
}

/**
 * @param {string} query
 * @param {!Array=} values
 * @return {!Promise}
 */
function query (query, values) {
  return connect().spread(function (client, done) {
    Promise.promisifyAll(client);
    return client.queryAsync(query, values)
        .finally(done)
        .get('rows');
  });
}

module.exports = {
  query: query
};

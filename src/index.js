var app = require('koa')(),
    bodyParser = require('koa-body-parser'),
    changes = require('./changes'),
    channels = require('./channels'),
    configuration = require('./configuration'),
    googleSiteVerification = configuration.GOOGLE_SITE_VERIFICATION,
    pings = require('./pings'),
    port = Number(process.env.PORT || 8080),
    route = require('koa-route'),
    users = require('./users');

app.use(bodyParser());

app.use(route.get('/' +  googleSiteVerification, function * () {
  this.body = 'google-site-verification: ' + googleSiteVerification;
  this.type = 'text/html';
}));

app.use(route.post('/notifications', function * () {
  var channelId = this.headers['x-goog-channel-id'],
      isSync = this.headers['x-goog-resource-state'] === 'sync',
      me = this;

  handleChange().finally(respond);

  /**
   * @return {!Promise}
   */
  function handleChange () {
    return isSync
        ? Promise.resolve()
        : changes.handleChange(me.request.body, channelId);
  }

  function respond () {
    me.body = '';
  }
}));

app.use(route.post('/pings', function * () {
  this.body = '';
  pings.refresh();
  users.maybeSync()
      .then(channels.refresh);
}));

app.listen(port);

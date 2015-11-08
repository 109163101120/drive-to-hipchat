var app = require('koa')(),
    bodyParser = require('koa-body-parser'),
    changes = require('./changes'),
    channels = require('./channels'),
    configuration = require('./configuration'),
    googleSiteVerification = configuration.GOOGLE_SITE_VERIFICATION,
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
      isSync = this.headers['x-goog-resource-state'] === 'sync';

  if (!isSync) {
    yield changes.handleChange(this.request.body, channelId)
        .catch(function () {});
  }

  yield ping();
  this.body = '';
}));

app.use(route.post('/ping', function * () {
  yield ping();
  this.body = '';
}));

app.use(route.post('/channels/remove', function * () {
  yield channels.removeAll();
  this.body = '';
}));

app.listen(port);

function ping() {
  return users.maybeSync()
      .then(channels.refresh);
}

module.exports = {
  // Set by Heroku
  DATABASE_URL: process.env.DATABASE_URL,

  // The email address of an admin account in the domain
  GOOGLE_ADMIN_EMAIL: process.env.GOOGLE_ADMIN_EMAIL,

  // The domain to watch (e.g. example.com)
  GOOGLE_DOMAIN: process.env.GOOGLE_DOMAIN,

  // Service account information from the Google Developer Console
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,

  // Site verification code from the Google Search Console
  GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,

  // The URL to which drive push notifications should be sent (e.g.
  // https://my-app.herokuapp.com/notifications)
  NOTIFICATION_URL: process.env.NOTIFICATION_URL,

  // The Slack API token to use
  SLACK_API_TOKEN: process.env.SLACK_API_TOKEN,

  // The ID of the Slack channel to post to
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,

  // The usernam to use when posting messages to Slack
  SLACK_USERNAME: process.env.SLACK_USERNAME
};

module.exports = {
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

  // A HipChat API token with the admin_room scope
  HIPCHAT_ROOM_ADMIN_TOKEN: process.env.HIPCHAT_ROOM_ADMIN_TOKEN,

  // The ID of the HipChat room to send notifications to
  HIPCHAT_ROOM_ID: parseInt(process.env.HIPCHAT_ROOM_ID, 10),

  // A HipChat API token with send_notification scope
  HIPCHAT_NOTIFICATION_TOKEN: process.env.HIPCHAT_NOTIFICATION_TOKEN,

  // The URL to which drive push notifications should be sent
  NOTIFICATION_URL: process.env.NOTIFICATION_URL,

  // The URL to which pings should be sent
  PING_URL: process.env.PING_URL
};

var config = {
    mongodbConnection : process.env.MONGODB_CONNECTION || 'mongodb://localhost/moreongo',
    sessionSecret: process.env.SESSION_SECRET || 'topp sicrettt',
    dateUrlFormat: 'D-M-YYYY',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: Number(process.env.SMTP_PORT) || 465,
    emailAccount: process.env.EMAIL_ACCOUNT,
    emailPassword: process.env.EMAIL_PASSWORD,
    hostName: process.env.HOST_NAME || 'localhost:3000',
    notificationsEnabled: process.env.NOTIFICATIONS_ENABLED === 'true' || false
}

module.exports = config;
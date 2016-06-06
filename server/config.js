var config = {
    mongodbConnection : process.env.MONGODB_CONNECTION || 'mongodb://localhost/moreongo',
    sessionSecret: process.env.SESSION_SECRET || 'topp sicrettt'
}

module.exports = config;
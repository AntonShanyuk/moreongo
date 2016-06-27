'use strict';

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');
moment.locale('ru');

var container = require('./di-container');

mongoose.connectAsync(container.config.mongodbConnection).catch(err => {
    console.error('Db connection failed. Error:');
    console.error(JSON.stringify(err));
    process.exit(1);
}).then(() => {
    var app = container.ExpressWrapper.init();
    app.listen(process.env.PORT || 3000);
}).catch(err => {
    console.error('Failed to initialize app. Error:');
    console.error(JSON.stringify(err));
    process.exit(1);
});
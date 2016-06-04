'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var model = mongoose.model('organization', {
    name: String,
    address: {},
    services: [{ name: String, price: Number }]
});

module.exports = Promise.promisifyAll(model);
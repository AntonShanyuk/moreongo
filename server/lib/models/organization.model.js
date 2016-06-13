'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var model = mongoose.model('organization', {
    name: String,
    address: String,
    location: { index: '2d', type: [Number] },
    services: [{ name: { type: String, index: true }, price: Number }],
    user: String
});

module.exports = Promise.promisifyAll(model);
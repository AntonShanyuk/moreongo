'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var model = mongoose.model('meeting', {
    organization: { type: String, ref: 'organization', required: true },
    service: String,
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
    email: String,
    phone: String,
    messages: [String]
});

module.exports = Promise.promisifyAll(model);
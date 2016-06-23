'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');

var model = mongoose.model('meeting', {
    organization: { type: String, ref: 'organization', required: true },
    service: String,
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
    email: String,
    phone: String,
    messages: [{ text: String, status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'] } }]
});

module.exports = Promise.promisifyAll(model);
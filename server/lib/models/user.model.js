'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: {
            unique: true
        }
    },
    hash: String
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

var model = mongoose.model('user', userSchema);

module.exports = Promise.promisifyAll(model);
'use strict';

var express = require('express');
var session = require('express-session')
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.js');
var onFinished = require('on-finished');
var passport = require('passport');
var User = require('./models/user.model');

let app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({secret: 'keyboard cat'}));
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/app', express.static(path.join(__dirname, '../client/app/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/landing/index.html'));
});

app.use((req, res, next) => {
    mongoose.connect(config.mongodbConntection, err => {
        next(err);
    });
    
    onFinished(res, (err, res) => {
        mongoose.disconnect();
    });
});

module.exports = app;
'use strict';

var Promise = require('bluebird');
var express = require('express');
var session = require('express-session')
var cookieParser = require('cookie-parser')
var expressValidator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var onFinished = require('on-finished');
var passport = require('passport');
var User = require('./models/user.model');
var _ = require('lodash');

class ExpressWrapper {
    constructor(config, apiRoutes) {
        this.config = config;
        this.apiRoutes = apiRoutes;
    }

    init() {
        let app = express();

        app.use('/client', express.static(path.join(__dirname, '../../client')));
        app.use('/app', express.static(path.join(__dirname, '../../client/app/build')));
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/landing/index.html'));
        });

        app.use(bodyParser.json());
        app.use(expressValidator({
            customValidators: {
                isArray: function (value) {
                    return _.isArray(value);
                },
                isString: function(value){
                    return _.isString(value);
                }
            }
        }));
        app.use(cookieParser());
        app.use(session({
            secret: this.config.sessionSecret,
            store: new MongoStore({ mongooseConnection: mongoose.connection }),
            resave: true,
            saveUninitialized: true
        }));

        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(User.createStrategy());
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());

        this.apiRoutes.init(app);

        return app;
    }
}

module.exports = ExpressWrapper;

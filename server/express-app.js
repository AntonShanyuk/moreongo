'use strict';

let express = require('express');
let path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config.js');
var onFinished = require('on-finished');

let app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    mongoose.connect(config.mongodbConntection, err => {
        next(err);
    });
    
    onFinished(res, (err, res) => {
        mongoose.disconnect();
    });
});

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/app', express.static(path.join(__dirname, '../client/app/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/landing/index.html'));
});

module.exports = app;
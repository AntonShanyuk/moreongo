'use strict';

let express = require('express');
let path = require('path');
var bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/app', express.static(path.join(__dirname, '../client/app/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/landing/index.html'));
});

module.exports = app;
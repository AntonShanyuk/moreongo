'use strict';

var container = require('./di-container');

var app = container.expressApp;
var apiRoutes = container.ApiRoutes;

apiRoutes.init();

app.listen(process.env.PORT || 3000);
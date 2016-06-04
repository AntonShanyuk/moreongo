var Bottle = require('bottlejs');

var orgnaizationModel = require('./models/organization-model');
var expressApp = require('./express-app');
var OrganizationController = require('./controllers/organization-controller');
var ApiRoutes = require('./api-routes');

var bottle = new Bottle();

bottle.value('expressApp', expressApp);
bottle.value('orgnaizationModel', orgnaizationModel);
bottle.service('OrganizationController', OrganizationController, 'orgnaizationModel');
bottle.service('ApiRoutes', ApiRoutes, 'expressApp', 'OrganizationController');

module.exports = bottle.container;
var Bottle = require('bottlejs');

var orgnaizationModel = require('./models/organization.model');
var userModel = require('./models/user.model');
var expressApp = require('./express-app');
var OrganizationController = require('./controllers/organization-controller');
var ApiRoutes = require('./api-routes');

var bottle = new Bottle();

bottle.value('expressApp', expressApp);
bottle.value('orgnaizationModel', orgnaizationModel);
bottle.value('userModel', userModel);
bottle.service('OrganizationController', OrganizationController, 'orgnaizationModel', 'userModel');
bottle.service('ApiRoutes', ApiRoutes, 'expressApp', 'OrganizationController');

module.exports = bottle.container;
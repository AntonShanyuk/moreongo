var Bottle = require('bottlejs');

var config = require('./config');

var orgnaizationModel = require('./lib/models/organization.model');
var userModel = require('./lib/models/user.model');
var ExpressWrapper = require('./lib/express-wrapper');
var OrganizationController = require('./lib/controllers/organization-controller');
var SessionController = require('./lib/controllers/session-controller');
var ApiRoutes = require('./lib/api-routes');

var bottle = new Bottle();

bottle.value('config', config);
bottle.value('orgnaizationModel', orgnaizationModel);
bottle.value('userModel', userModel);

bottle.service('SessionController', SessionController, 'orgnaizationModel');
bottle.service('OrganizationController', OrganizationController, 'orgnaizationModel', 'userModel');
bottle.service('ApiRoutes', ApiRoutes, 'OrganizationController', 'SessionController');
bottle.service('ExpressWrapper', ExpressWrapper, 'config', 'ApiRoutes');

module.exports = bottle.container;
var Bottle = require('bottlejs');

var config = require('./config');

var orgnaizationModel = require('./models/organization.model');
var userModel = require('./models/user.model');
var ExpressWrapper = require('./express-wrapper');
var OrganizationController = require('./controllers/organization-controller');
var SessionController = require('./controllers/session-controller');
var ApiRoutes = require('./api-routes');

var bottle = new Bottle();

bottle.value('config', config);
bottle.value('orgnaizationModel', orgnaizationModel);
bottle.value('userModel', userModel);

bottle.service('SessionController', SessionController, 'orgnaizationModel');
bottle.service('OrganizationController', OrganizationController, 'orgnaizationModel', 'userModel');
bottle.service('ApiRoutes', ApiRoutes, 'OrganizationController', 'SessionController');
bottle.service('ExpressWrapper', ExpressWrapper, 'config', 'ApiRoutes');

module.exports = bottle.container;
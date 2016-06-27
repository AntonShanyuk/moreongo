var Bottle = require('bottlejs');

var config = require('./config');

var orgnaizationModel = require('./lib/models/organization.model');
var userModel = require('./lib/models/user.model');
var meetingModel = require('./lib/models/meeting.model');

var ExpressWrapper = require('./lib/express-wrapper');
var OrganizationController = require('./lib/controllers/organization-controller');
var SessionController = require('./lib/controllers/session-controller');
var MeetingController = require('./lib/controllers/meeting-controller');
var ApiRoutes = require('./lib/api-routes');
var ValidationChecker = require('./lib/validation-checker');
var EmailSender = require('./lib/email-sender');

var bottle = new Bottle();

bottle.value('config', config);
bottle.value('orgnaizationModel', orgnaizationModel);
bottle.value('userModel', userModel);
bottle.value('meetingModel', meetingModel);

bottle.service('EmailSender', EmailSender, 'config');
bottle.service('ValidationChecker', ValidationChecker);
bottle.service('SessionController', SessionController, 'orgnaizationModel');
bottle.service('OrganizationController', OrganizationController, 'orgnaizationModel', 'userModel', 'ValidationChecker');
bottle.service('MeetingController', MeetingController, 'config', 'meetingModel', 'orgnaizationModel', 'ValidationChecker', 'EmailSender');
bottle.service('ApiRoutes', ApiRoutes, 'OrganizationController', 'SessionController', 'MeetingController');
bottle.service('ExpressWrapper', ExpressWrapper, 'config', 'ApiRoutes');

module.exports = bottle.container;
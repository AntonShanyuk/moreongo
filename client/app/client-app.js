require('./index.scss');

var mapService = require('./services/map.service');

var organization = require('./api/organization.resource.js');
var session = require('./api/session.resource.js');
var defaults = require('./api/defaults.resource.js');

var collapsePanelDirective = require('./components/collapse-panel/collapse-panel.directive');
var collapseOnClickDirective = require('./components/nav-collapse-on-click/nav-collapse-on-click.directive');

var routesConfig = require('./config/routes.config');
var httpConfig = require('./config/http.config');
var mapsConfig = require('./config/maps.config');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'ui.utils.masks', 'focusOn', 'ngResource', 'debounce', 'duScroll']);

app
    .config(routesConfig)
    .config(mapsConfig)
    .config(httpConfig)

    .service('mapService', mapService)

    .factory('session', session)
    .factory('organization', organization)
    .factory('defaults', defaults)

    .directive('collapsePanel', collapsePanelDirective)
    .directive('navCollapseOnClick', collapseOnClickDirective);
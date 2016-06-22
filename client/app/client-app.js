require('./index.scss');

var mapService = require('./services/map.service');
var moment = require('moment');

var organization = require('./api/organization.resource.js');
var session = require('./api/session.resource.js');
var defaults = require('./api/defaults.resource.js');

var collapsePanelDirective = require('./directives/collapse-panel/collapse-panel.directive');
var collapseOnClickDirective = require('./directives/nav-collapse-on-click/nav-collapse-on-click.directive');

var dateTimePickerComponent = require('./components/date-time-picker/date-time-picker.component');

var routesConfig = require('./config/routes.config');
var httpConfig = require('./config/http.config');
var mapsConfig = require('./config/maps.config');

var app = angular.module('moreongo',
    ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'ui.utils.masks', 'focusOn', 'ngResource', 'debounce', 'duScroll', 'ui.bootstrap', 'angularMoment', 'angular-click-outside',
        'ui.mask']);

app
    .config(routesConfig)
    .config(mapsConfig)
    .config(httpConfig)

    /** @ngInject */
    .run(function (amMoment) {
        moment.locale('ru');
        amMoment.changeLocale('ru');
    })

    .service('mapService', mapService)

    .factory('session', session)
    .factory('organization', organization)
    .factory('defaults', defaults)

    .directive('collapsePanel', collapsePanelDirective)
    .directive('navCollapseOnClick', collapseOnClickDirective)

    .component('dateTimePicker', dateTimePickerComponent);
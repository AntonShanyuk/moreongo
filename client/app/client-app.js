require('./index.scss');
require('angular-toastr/dist/angular-toastr.css');

var mapService = require('./services/map.service');
var moment = require('moment');

var organization = require('./api/organization.resource');
var session = require('./api/session.resource');
var defaults = require('./api/defaults.resource');
var meeting = require('./api/meeting.resource');

var collapsePanelDirective = require('./directives/collapse-panel/collapse-panel.directive');
var collapseOnClickDirective = require('./directives/nav-collapse-on-click/nav-collapse-on-click.directive');

var dateTimePickerComponent = require('./components/date-time-picker/date-time-picker.component');
var createMeetingFormComponent = require('./components/create-meeting-form/create-meeting-form.component');
var manageMeetingFormComponent = require('./components/manage-meeting-form/manage-meeting-form.component');

var routesConfig = require('./config/routes.config');
var httpConfig = require('./config/http.config');
var mapsConfig = require('./config/maps.config');
var toastrConfig = require('./config/toastr.config');

var app = angular.module('moreongo',
    ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'ui.utils.masks', 'focusOn', 'ngResource', 'debounce', 'duScroll', 'ui.bootstrap', 'angularMoment', 'angular-click-outside',
        'ui.mask', 'toastr']);

app
    .config(routesConfig)
    .config(mapsConfig)
    .config(httpConfig)
    .config(toastrConfig)

    /** @ngInject */
    .run(function (amMoment) {
        moment.locale('ru');
        amMoment.changeLocale('ru');
    })

    .service('mapService', mapService)

    .factory('session', session)
    .factory('organization', organization)
    .factory('defaults', defaults)
    .factory('meeting', meeting)

    .directive('collapsePanel', collapsePanelDirective)
    .directive('navCollapseOnClick', collapseOnClickDirective)

    .component('dateTimePicker', dateTimePickerComponent)
    .component('createMeetingForm', createMeetingFormComponent)
    .component('manageMeetingForm', manageMeetingFormComponent)
    
    .constant('dateUrlFormat', 'D-M-YYYY');
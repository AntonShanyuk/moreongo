require('./index.scss');

var mapService = require('./services/map.service');
var stateService = require('./services/state.service');

var organization = require('./api/organization.resource.js');
var session = require('./api/session.resource.js');

require('./home/home.scss');
var homeTemplate = require('./home/home.html');
var homeController = require('./home/home.controller');

require('./my-service/my-service.scss');
var registerServiceTemplate = require('./my-service/my-service.html');
var registerServiceController = require('./my-service/my-service.controller');

var loginTemplate = require('./login/login.html');
var loginController = require('./login/login.controller');

var registerServiceMapTemplate = require('./my-service/my-service-map.html');
var registerServiceMapController = require('./my-service/my-service-map.controller');

var collapsePanelDirective = require('./components/collapse-panel/collapse-panel.directive');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'ui.utils.masks', 'focusOn', 'ngResource']);

app.config(
    /** @ngInject */
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/?city&service&serviceId',
                abstract: true,
                template: homeTemplate,
                controller: homeController,
                controllerAs: 'vm',
                resolve: {
                    /** @ngInject */
                    currentSession: function (session) {
                        return session.get().$promise;
                    }
                }
            })
            .state('home.login', {
                url: 'login/',
                views: {
                    scroll: {
                        template: loginTemplate,
                        controller: loginController,
                        controllerAs: 'vm'
                    },
                    map: {}
                }
            })
            .state('home.search', {
                url: '',
                views: {
                    scroll: {},
                    map: {}
                }
            })
            .state('home.registerService', {
                url: 'register-service/',
                views: {
                    scroll: {
                        template: registerServiceTemplate,
                        controller: registerServiceController,
                        controllerAs: 'vm'
                    },
                    map: {
                        template: registerServiceMapTemplate,
                        controller: registerServiceMapController,
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    myOrganization: function () {
                        return null;
                    }
                }
            })
            .state('home.myService', {
                url: 'my-service/',
                views: {
                    scroll: {
                        template: registerServiceTemplate,
                        controller: registerServiceController,
                        controllerAs: 'vm'
                    },
                    map: {
                        template: registerServiceMapTemplate,
                        controller: registerServiceMapController,
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    myOrganization: function (organization) {
                        return organization.my().$promise;
                    }
                }
            });
    }).config(
    /** @ngInject */
    function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            language: 'uk'
        });
    });


app.service('mapService', mapService);
app.service('stateService', stateService);

app.factory('session', session);
app.factory('organization', organization);

app.directive('collapsePanel', collapsePanelDirective);
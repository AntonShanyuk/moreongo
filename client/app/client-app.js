require('./index.scss');

var mapService = require('./services/map.service');
var stateService = require('./services/state.service');

var organization = require('./api/organization.resource.js');
var session = require('./api/session.resource.js');

require('./pages/home/home.scss');
var homeTemplate = require('./pages/home/home.html');
var homeController = require('./pages/home/home.controller');

require('./pages/my-service/my-service.scss');
var registerServiceTemplate = require('./pages/my-service/my-service.html');
var registerServiceController = require('./pages/my-service/my-service.controller');

var loginTemplate = require('./pages/login/login.html');
var loginController = require('./pages/login/login.controller');

var registerServiceMapTemplate = require('./pages/my-service/my-service-map.html');
var registerServiceMapController = require('./pages/my-service/my-service-map.controller');

var collapsePanelDirective = require('./components/collapse-panel/collapse-panel.directive');
var collapseOnClickDirective = require('./components/nav-collapse-on-click/nav-collapse-on-click.directive');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'ui.utils.masks', 'focusOn', 'ngResource']);

app.config(
    /** @ngInject */
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/?city&service',
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
    }).config(
    /** @ngInject */
    function ($httpProvider) {
        $httpProvider.interceptors.push(function () {
            return {
                'request': function (config) {
                    if (config.method == 'GET') {
                        if (!config.params) {
                            config.params = {};
                        }

                        config.params.d = new Date().getTime();
                    }

                    return config;
                }
            };
        })
    });


app.service('mapService', mapService);
app.service('stateService', stateService);

app.factory('session', session);
app.factory('organization', organization);

app.directive('collapsePanel', collapsePanelDirective);
app.directive('navCollapseOnClick', collapseOnClickDirective);
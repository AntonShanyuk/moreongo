require('./index.scss');

var mapService = require('./services/map.service');
var stateService = require('./services/state.service');

var organization = require('./api/organization.resource.js');
var session = require('./api/session.resource.js');

require('./home/home.scss');
var homeTemplate = require('./home/home.html');
var homeController = require('./home/home.controller');

require('./register-service/register-service.scss');
var registerServiceTemplate = require('./register-service/register-service.html');
var registerServiceController = require('./register-service/register-service.controller');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'rt.eventemitter', 'ui.utils.masks', 'focusOn', 'ngResource']);

app.config(
    /** @ngInject */
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
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
            .state('home.search', {
                url: '?city&cityId&service&serviceId',
                views: {
                    scroll: {}
                },
                resolve: {
                    /** @ngInject */
                    init: function (mapService) {
                        mapService.removeCircle();
                    }
                }
            })
            .state('home.registerService', {
                url: 'register-service/',
                views: {
                    scroll: {
                        template: registerServiceTemplate,
                        controller: registerServiceController,
                        controllerAs: 'vm'
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
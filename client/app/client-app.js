require('./index.scss');

var mapService = require('./services/map.service');

require('./home/home.scss');
var homeTemplate = require('./home/home.html');
var homeController = require('./home/home.controller');

require('./register-service/register-service.scss');
var registerServiceTemplate = require('./register-service/register-service.html');
var registerServiceController = require('./register-service/register-service.controller');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'rt.eventemitter', 'ui.utils.masks', 'focusOn']);

app.config(
    /** @ngInject */
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                abstract: true,
                template: homeTemplate,
                controller: homeController,
                controllerAs: 'vm'
            })
            .state('home.search', {
                url: '?city&cityId&service&serviceId',
                views: {
                    scroll: {},
                    rightPanel: {
                        template: '<a ui-sref="home.registerService" class="btn btn-lg btn-danger">Добавить мой сервис</a>'
                    }
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
                    },
                    rightPanel: {
                        template: '<a ui-sref="home.search" class="btn btn-lg btn-default">Назад к результатам поиска</a>'
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

app.component('navigationButton', navigationButtonComponent);
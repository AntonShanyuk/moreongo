require('./index.scss');

var mapService = require('./services/map.service');

require('./home/home.scss');
var homeTemplate = require('./home/home.html');
var homeController = require('./home/home.controller');

require('./register-service/register-service.scss');
var registerServiceTemplate = require('./register-service/register-service.html');
var registerServiceController = require('./register-service/register-service.controller');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging', 'rt.eventemitter']);

app.config(
     /** @ngInject */
    function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/?city&cityId&service&serviceId',
            template: homeTemplate,
            controller: homeController,
            controllerAs: 'vm'
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
        });
}).config(
     /** @ngInject */
    function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        language: 'uk'
    });
});

app.service('mapService', mapService);
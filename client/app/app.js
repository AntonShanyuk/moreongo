require('./index.scss');

require('./home/home.scss');
var homeController = require('./home/home.controller');

var app = angular.module('moreongo', ['ui.router', 'uiGmapgoogle-maps', 'nemLogging']);

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/?city&cityId&service&serviceId',
        templateUrl: '/app/home/home.html',
        controller: homeController,
        controllerAs: 'vm'
    });
});
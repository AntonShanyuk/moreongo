'use strict';

require('../pages/home-navbar/home-navbar.scss');
var homeNavbarTemplate = require('../pages/home-navbar/home-navbar.html');
var homeNavbarController = require('../pages/home-navbar/home-navbar.controller');

require('../pages/home-map/home-map.scss');
var homeMapTemplate = require('../pages/home-map/home-map.html');
var homeMapController = require('../pages/home-map/home-map.controller');

require('../pages/my-service/my-service.scss');
var registerServiceTemplate = require('../pages/my-service/my-service.html');
var registerServiceController = require('../pages/my-service/my-service.controller');

var loginTemplate = require('../pages/login/login.html');
var loginController = require('../pages/login/login.controller');

var registerServiceMapTemplate = require('../pages/my-service/my-service-map.html');
var registerServiceMapController = require('../pages/my-service/my-service-map.controller');

require('../pages/search/search.scss');
var searchTemplate = require('../pages/search/search.html');
var searchController = require('../pages/search/search.controller');

var searchMapTemplate = require('../pages/search/search-map.html');
var searchMapController = require('../pages/search/search-map.controller');

/** @ngInject */
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            abstract: true,
            template: homeNavbarTemplate,
            controller: homeNavbarController,
            controllerAs: 'vm',
            resolve: {
                /** @ngInject */
                currentSession: function (session) {
                    return session.get().$promise;
                }
            }
        })
        .state('home.map', {
            abstract: true,
            url: '/?city&service&lat&lng&zoom',
            template: homeMapTemplate,
            controller: homeMapController,
            controllerAs: 'vm',
            resolve: {
                /** @ngInject */
                defaultData: function (defaults) {
                    return defaults.get().$promise;
                },
                /** @ngInject */
                location: resolveLocation
            }
        })
        .state('home.map.login', {
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
        .state('home.map.search', {
            url: '',
            views: {
                scroll: {
                    template: searchTemplate,
                    controller: searchController,
                    controllerAs: 'vm'
                },
                map: {
                    template: searchMapTemplate,
                    controller: searchMapController,
                    controllerAs: 'vm'
                }
            },
            resolve: {
                location: resolveLocation,
                /** @ngInject */
                organizations: function ($stateParams, location, organization) {
                    return organization.search({
                        lat: location.latitude,
                        lng: location.longitude,
                        service: $stateParams.service,
                        zoom: location.zoom
                    }).$promise;
                }
            }
        })
        .state('home.map.registerService', {
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
        .state('home.map.myService', {
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
                /** @ngInject */
                myOrganization: function (organization) {
                    return organization.my().$promise;
                }
            }
        });


    /** @ngInject */
    function resolveLocation($stateParams, mapService, defaultData, $window) {
        var zoom = Number($stateParams.zoom || 12);
        var lastSearch = $window.localStorage.getItem("lastSearch");
        if ($stateParams.lat && $stateParams.lng) {
            return {
                latitude: Number($stateParams.lat),
                longitude: Number($stateParams.lng),
                zoom: zoom
            }
        } else if ($stateParams.city || lastSearch) {
            var city = $stateParams.city || lastSearch;
            return mapService.getPosition(city).then(function (location) {
                $window.localStorage.setItem('lastSearch', city);
                return {
                    latitude: location.lat(),
                    longitude: location.lng(),
                    city: $stateParams.city,
                    zoom: zoom
                };
            });
        } else {
            return {
                latitude: defaultData.location.latitude,
                longitude: defaultData.location.longitude,
                city: defaultData.city,
                zoom: zoom
            };
        }
    }
    $urlRouterProvider.otherwise('/');
};
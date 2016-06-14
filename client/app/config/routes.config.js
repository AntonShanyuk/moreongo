'use strict';

require('../pages/home/home.scss');
var homeTemplate = require('../pages/home/home.html');
var homeController = require('../pages/home/home.controller');

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

module.exports =
    /** @ngInject */
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
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
            .state('home.map', {
                abstract: true,
                url: '/?city&service',
                template: homeMapTemplate,
                controller: homeMapController,
                controllerAs: 'vm',
                resolve: {
                    /** @ngInject */
                    defaultData: function (defaults) {
                        return defaults.get().$promise;
                    },
                    /** @ngInject */
                    location: function ($stateParams, mapService, defaultData) {
                        if ($stateParams.city) {
                            return mapService.getPosition($stateParams.city).then(function (location) {
                                return {
                                    latitude: location.lat(),
                                    longitude: location.lng()
                                };
                            });
                        } else {
                            return defaultData.location;
                        }
                    }
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
                    organizations: function ($stateParams, location, organization) {
                        return organization.search({
                            lat: location.latitude,
                            lng: location.longitude,
                            service: $stateParams.service
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
                    myOrganization: function (organization) {
                        return organization.my().$promise;
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    };
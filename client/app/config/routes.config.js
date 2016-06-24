'use strict';

var moment = require('moment');
var _ = require('lodash');

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

require('../pages/my-meetings/my-meetings.scss');
var myMeetingsTemplate = require('../pages/my-meetings/my-meetings.html');
var myMeetingsController = require('../pages/my-meetings/my-meetings.controller');

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
                },
                /** @ngInject */
                location: resolveLocation
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
        })
        .state('home.map.myService.meetings', {
            url: 'meetings/?date?id',
            template: myMeetingsTemplate,
            controller: myMeetingsController,
            controllerAs: 'vm',
            resolve: {
                /** @ngInject */
                meetings: function ($stateParams, meeting, dateUrlFormat) {
                    var momentDate = moment($stateParams.date, dateUrlFormat);
                    var date = momentDate.isValid() ? momentDate.toDate() : null;
                    return meeting.getMy({ date: date }).$promise.then(function (meetings) {
                        _.forEach(meetings, function (meeting) {
                            meeting.collapsed = meeting._id != $stateParams.id;
                            meeting.passed = moment(meeting.date).isBefore(moment());
                        });
                        return _(meetings).filter(function (meeting) {
                            return !meeting.passed;
                        }).groupBy(function (meeting) {
                            return moment(meeting.date).startOf('day').format(dateUrlFormat);
                        }).value();
                    });;
                }
            }
        });


    /** @ngInject */
    function resolveLocation($stateParams, mapService, defaultData, $window) {
        var zoom = Number($stateParams.zoom || 12);
        var lastSearch = $window.localStorage.getItem("lastSearch");
        if ($stateParams.lat && $stateParams.lng) {
            var result = {
                latitude: Number($stateParams.lat),
                longitude: Number($stateParams.lng),
                zoom: zoom
            };

            $window.localStorage.setItem('lastSearch', JSON.stringify(result));
            return result;
        } else if ($stateParams.city) {
            var city = $stateParams.city || lastSearch;
            return mapService.getPosition(city).then(function (location) {
                var result = {
                    latitude: location.lat(),
                    longitude: location.lng(),
                    city: $stateParams.city,
                    zoom: zoom
                };

                $window.localStorage.setItem('lastSearch', JSON.stringify(result));
                return result;
            });
        } else if (lastSearch) {
            return JSON.parse(lastSearch);
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
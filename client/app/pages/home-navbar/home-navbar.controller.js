'use strict';

var Bloodhound = require('typeahead.js');

/** @ngInject */
module.exports = function (mapService, currentSession, session, $state, $scope, $rootScope) {
    var vm = this;
    vm.isAuthenticated = currentSession.isAuthenticated;
    vm.organizationName = currentSession.organizationName;
    vm.service = '';

    vm.changeCity = function () {
        $state.go('home.map.search', { city: vm.city, lat: null, lng: null });
    }

    vm.changeService = function () {
        $state.go('home.map.search', { service: vm.service });
    }

    $rootScope.$on('cityChanged', function (event, city, init) {
        if (init) {
            vm.city = city;
        }
    });

    $rootScope.$on('serviceChanged', function (event, service, init) {
        if (init) {
            vm.service = service;
        }
    });

    vm.logout = function () {
        session.delete().$promise.then(function () {
            $state.go('home.map.search', {}, { reload: 'home' });
        });
    }

    vm.requestLocation = function () {
        mapService.requestLocation().then(function (location) {
            $scope.$emit('mapCenterSet', location);
            return mapService.getAddress(location);
        }).then(function (address) {
            vm.city = address.formatted_address;
            $scope.$emit('cityChanged', address.formatted_address);
        });
    }

    var services = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('_id'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: '/api/services/%term',
            wildcard: '%term'
        }
    });

    vm.servicesTypeahead = {
        display: '_id',
        source: services
    }
}
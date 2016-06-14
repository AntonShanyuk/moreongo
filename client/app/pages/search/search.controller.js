'use strict';

var _ = require('lodash');

/** @ngInject */
module.exports = function (organizations, $rootScope, $scope, $state, location) {
    var vm = this;

    vm.organizations = organizations;
    vm.book = function (service) {
        console.log(service);
    }

    vm.hide = function (organization) {
        organization.highlight = false;
    }

    var highlightEventDestructor = $rootScope.$on('organization.highlight', function (event, id) {
        var highlighted = _.find(vm.organizations, { highlight: true });
        if (highlighted) {
            highlighted.highlight = false;
        }
        _.find(vm.organizations, { _id: id }).highlight = true;
        $scope.$apply();
    });

    var boundsChangedEventDestructor = $rootScope.$on('mapBoundsChanged', function (event, args) {
        $state.go('home.map.search', { lat: args.latitude, lng: args.longitude, city: null }, { reload: 'home.map.search' });
    });

    var zoomChangedEventDestructor = $rootScope.$on('mapZoomChanged', function (event, zoom) {
        $state.go('home.map.search', { zoom: zoom }, { reload: 'home.map.search' });
    });

    var cityChangedEventDestructor = $rootScope.$on('cityChanged', function (event, city, init) {
        if(!init){
            $state.go('home.map.search', { city: city, lat: null, lng: null }, { reload: 'home.map.search' });
        }
    });

    $scope.$on('$destroy', function () {
        highlightEventDestructor();
        boundsChangedEventDestructor();
        zoomChangedEventDestructor();
        cityChangedEventDestructor();
    });
}
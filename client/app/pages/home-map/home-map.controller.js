'use strict';

/** @ngInject */
module.exports = function ($rootScope, $scope, $stateParams, location, debounce, $timeout) {
    var vm = this;

    vm.map = { center: location, zoom: 14 };
    vm.map.events = {
        center_changed: debounce(function (map) {
            $scope.$emit('mapBoundsChanged', {
                latitude: map.center.lat(),
                longitude: map.center.lng()
            });
        }, 200)
    }

    $rootScope.$on('mapCenterSet', function (event, position) {
        vm.map.center = {
            latitude: position.latitude,
            longitude: position.longitude
        };
    });

    $timeout(function () {
        $scope.$emit('cityChanged', $stateParams.city, true);
        $scope.$emit('serviceChanged', $stateParams.service, true);
    });
}
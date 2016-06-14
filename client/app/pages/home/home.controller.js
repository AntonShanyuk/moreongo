/** @ngInject */
module.exports = function (mapService, currentSession, session, $state, $scope, $rootScope) {
    var vm = this;
    vm.isAuthenticated = currentSession.isAuthenticated;
    vm.organizationName = currentSession.organizationName;

    vm.options = { scrollwheel: false };

    vm.changeCity = function () {
        $state.go('home.map.search', { city: vm.city });
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
            $scope.$emit('cityChanged', address.formatted_address);
        });
    }
}
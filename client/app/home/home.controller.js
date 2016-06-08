/** @ngInject */
module.exports = function (mapService, stateService, currentSession, session, $state, $stateParams, $rootScope, $scope) {
    var vm = this;

    vm.map = { center: { latitude: 50.4223541, longitude: 30.5211557 }, zoom: 14 };

    vm.city = $stateParams.city;
    vm.isAuthenticated = currentSession.isAuthenticated;
    vm.organizationName = currentSession.organizationName;

    vm.state = stateService.home;

    vm.options = { scrollwheel: false };

    vm.changeCity = function(){
        $scope.$emit('cityChanged', vm.city);
        mapService.getPosition(vm.city).then(function(position){
            var location = position.geometry.location;
            vm.map.center = {
                latitude: location.lat(),
                longitude: location.lng()
            }
        });
    }
    vm.changeCity();

    vm.logout = function () {
        session.delete().$promise.then(function () {
            $state.go('home.search', {}, { reload: 'home' });
        });
    }

    $rootScope.$on('mapCenterSet', function(event, position){
        vm.map.center = {
            latitude: position.latitude,
            longitude: position.longitude
        };
    });
}
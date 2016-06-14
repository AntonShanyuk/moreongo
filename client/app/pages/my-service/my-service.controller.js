var _ = require('lodash');

/** @ngInject */
module.exports = function (mapService, $scope, focus, organization, $state, myOrganization, $rootScope) {
    var vm = this;

    if (myOrganization) {
        vm.edit = true;
        vm.address = myOrganization.address;
        vm.name = myOrganization.name;
        vm.services = myOrganization.services.concat([{ name: '', price: '' }]);
        setPosition();
    } else { 
        vm.services = [{ name: '', price: 0 }];
    }

    $rootScope.$on('cityChanged', function (event, city) {
        if (!vm.edit) {
            vm.address = city;
            setPosition();
        }
    });

    vm.addressChanged = function () {
        setPosition();
    }

    vm.serviceChange = function (service) {
        var emptyServices = _.filter(vm.services, { name: '' });
        if (!emptyServices || !emptyServices.length) {
            vm.services.push({ name: '', price: 0 });
        } else if (emptyServices.length > 1) {
            var index = vm.services.indexOf(service);
            focus((index - 1).toString());
            vm.services.splice(index, 1);
        }
    }

    vm.requestLocation = function () {
        mapService.requestLocation().then(function (location) {
            $scope.$emit('mapCenterSet', location);
            return mapService.getAddress(location);
        }).then(function (address) {
            $scope.$emit('cityChanged', address.formatted_address);
        });
    }

    vm.registerService = function () {
        var promise;
        if (vm.edit) {
            promise = organization.put({
                _id: myOrganization._id,
                address: vm.address,
                name: vm.name,
                services: notEmptyServices(),
                location: vm.location
            }).$promise;
        } else {
            promise = organization.post({
                name: vm.name,
                address: vm.address,
                location: vm.location,
                services: notEmptyServices(),
                email: vm.email,
                password: vm.password
            }).$promise;
        }
        promise.then(function () {
            $state.go('home.map.search', {}, { reload: 'home' });
        });
    }

    $rootScope.$on('registrationCircleDragged', function (event, position) {
        setAddress(position);
    });

    function setAddress(position) {
        mapService.getAddress(position).then(function (address) {
            vm.address = address.formatted_address;
            vm.location = [position.longitude, position.latitude];
            focus('name');
        });
    }

    function setPosition() {
        mapService.getPosition(vm.address).then(function (location) {
            vm.location = [location.lng(), location.lat()];
            $scope.$emit('registrationCircleSet', {
                latitude: location.lat(),
                longitude: location.lng()
            });
        });
    }

    function notEmptyServices() {
        return _.filter(vm.services, function (service) {
            return !!service.name;
        });
    }

    function initMapPosition(position) {
        $scope.$emit('registrationCircleSet', position);
        setAddress(position);
    }
}
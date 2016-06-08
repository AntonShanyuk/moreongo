var _ = require('lodash');

/** @ngInject */
module.exports = function (mapService, uiGmapGoogleMapApi, $scope, focus, stateService, organization, $state, myOrganization, $stateParams, $rootScope) {
    var vm = this;

    if (myOrganization) {
        console.log(myOrganization);
        vm.edit = true;
        vm.address = myOrganization.address.formatted_address;
        vm.name = myOrganization.name;
        vm.services = myOrganization.services.concat([{ name: '', price: '' }]);
        setPosition();
    } else {
        if ($stateParams.city) {
            vm.address = $stateParams.city;
            setPosition();
        } else {
            mapService.requestLocation(initMapPosition);
        }

        vm.services = [{ name: '', price: 0 }];
    }

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

    vm.registerService = function () {
        var promise;
        if (vm.edit) {
            promise = organization.put({
                _id: myOrganization._id,
                name: vm.name,
                services: notEmptyServices(),
                address: vm.addressObject
            }).$promise;
        } else {
            promise = organization.post({
                name: vm.name,
                address: vm.addressObject,
                services: notEmptyServices(),
                email: vm.email,
                password: vm.password
            }).$promise;
        }
        promise.then(function () {
            $state.go('home.search', {}, { reload: 'home' });
        });
    }

    $rootScope.$on('registrationCircleDragged', function (event, position) {
        setAddress(position);
    });

    function setAddress(position) {
        mapService.getAddress(position).then(function (address) {
            vm.address = address.formatted_address;
            vm.addressObject = address;
            focus('name');
        });
    }

    function setPosition() {
        mapService.getPosition(vm.address).then(function (position) {
            var location = position.geometry.location;
            vm.addressObject = position;
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
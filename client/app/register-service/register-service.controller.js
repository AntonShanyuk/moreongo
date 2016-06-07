var _ = require('lodash');

/** @ngInject */
module.exports = function (mapService, uiGmapGoogleMapApi, $scope, focus, stateService, organization, $state, myOrganization) {
    var vm = this;

    if (myOrganization) {
        vm.edit = true;
        vm.address = myOrganization.address[0].formatted_address;
        vm.name = myOrganization.name;
        vm.services = myOrganization.services.concat([{name: '', price: ''}]);
        var location = myOrganization.address[0].geometry.location;
        setAddress({
            latitude: location.lat,
            longitude: location.lng
        });
    } else {
        vm.services = [{ name: '', price: 0 }];
    }

    vm.addressChanged = function () {
        setPosition(vm.address);
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
        if (vm.edit) {
            organization.put({
                _id: myOrganization._id,
                name: vm.name,
                services: notEmptyServices(),
                address: vm.addressObject
            });
        } else {
            organization.post({
                name: vm.name,
                address: vm.addressObject,
                services: notEmptyServices(),
                email: vm.email,
                password: vm.password
            }).$promise.then(function () {
                $state.go('home.search', {}, { reload: 'home' });
            });
        }
    }

    mapService.requestLocation(function (position) {
        mapService.setCircleLocation(position);
        setAddress(position);
    });

    mapService.on('circleLocationChanged', function (position) {
        setAddress(position);
    });

    function setAddress(position) {
        uiGmapGoogleMapApi.then(function (maps) {
            var geocoder = new maps.Geocoder();
            geocoder.geocode({
                location: {
                    lat: position.latitude,
                    lng: position.longitude
                }
            }, function (address) {
                if (address && address.length) {
                    vm.address = address[0].formatted_address;
                    vm.addressObject = address;
                    focus('name');
                    $scope.$apply();
                }
            });
        });
    }

    function setPosition(address) {
        uiGmapGoogleMapApi.then(function (maps) {
            var geocoder = new maps.Geocoder();
            geocoder.geocode({
                address: address
            }, function (position) {
                if (position && position.length) {
                    var location = position[0].geometry.location;
                    mapService.setCircleLocation({
                        latitude: location.lat(),
                        longitude: location.lng()
                    })
                }
            });
        });
    }

    function notEmptyServices() {
        return _.filter(vm.services, function (service) {
            return !!service.name;
        });
    }
}
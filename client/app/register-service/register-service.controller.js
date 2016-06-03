var _ = require('lodash');

/** @ngInject */
module.exports = function (mapService, uiGmapGoogleMapApi, $scope, focus) {
    var vm = this;

    vm.services = [{ text: '', price: 0 }];

    vm.addressChanged = function () {
        setPosition(vm.address);
    }

    vm.serviceChange = function (service) {
        var emptyServices = _.filter(vm.services, { text: '' });
        if (!emptyServices || !emptyServices.length) {
            vm.services.push({ text: '', price: 0 });
        } else if (emptyServices.length > 1) {
            var index = vm.services.indexOf(service);
            focus((index -1).toString());
            vm.services.splice(index, 1);
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
}
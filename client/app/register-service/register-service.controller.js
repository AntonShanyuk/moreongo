/** @ngInject */
module.exports = function (mapService, uiGmapGoogleMapApi, $scope) {
    var vm = this;

    vm.addressChanged = function () {
        setPosition(vm.address);
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
                if(position && position.length){
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
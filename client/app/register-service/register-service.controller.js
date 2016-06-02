module.exports = function (mapService, uiGmapGoogleMapApi, $scope) {
    var vm = this;
    
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
            }, function(address){
                if(address && address.length){
                    vm.address = address[0].formatted_address;
                    $scope.$apply();
                }
            });
        });
    }
}
 /** @ngInject */
module.exports = function (mapService) {
    var vm = this;

    vm.map = { center: { latitude:  50.4223541, longitude: 30.5211557 }, zoom: 14 };
    vm.circleCenter = { latitude:  50.4223541, longitude: 30.5211557 };
    
    vm.options = { scrollwheel: false };
        vm.circle = {
        radius: 150,
        stroke: {
            color: '#08B21F',
            weight: 2,
            opacity: 1
        },
        fill: {
            color: '#08B21F',
            opacity: 0.5
        },
        events: {
            dragend: function(circle){
                mapService.userChangedCircleLocation({
                    latitude: circle.center.lat(),
                    longitude: circle.center.lng()
                });
            }
        }
    };

    mapService.requestLocation(function (position) {
        vm.map.center.longitude = position.longitude;
        vm.map.center.latitude = position.latitude;
    });

    mapService.on('circleLocationSet', function (position) {
        vm.circleCenter = {
            latitude: position.latitude,
            longitude: position.longitude
        };
        vm.map.center = {
            latitude: position.latitude,
            longitude: position.longitude
        };
    });
}
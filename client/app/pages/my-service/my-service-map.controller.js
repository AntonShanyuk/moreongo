/** @ngInject */
module.exports = function ($scope, $rootScope) {
    var vm = this;

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
            dragend: function (circle) {
                $scope.$emit('registrationCircleDragged', {
                    latitude: circle.center.lat(),
                    longitude: circle.center.lng()
                });
            }
        }
    };

    var circleSetDestructor = $rootScope.$on('registrationCircleSet', function (event, position) {
        vm.circleCenter = {
            latitude: position.latitude,
            longitude: position.longitude
        };
        $scope.$emit('mapCenterSet', position);
    });

    $scope.$on('$destroy', function(){
        circleSetDestructor();
    });
}
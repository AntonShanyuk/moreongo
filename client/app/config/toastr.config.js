/** @ngInject */
module.exports = function(toastrConfig) {
    angular.extend(toastrConfig, {
        timeOut: 500000,
        target: '.toastr-panel'
    });
}
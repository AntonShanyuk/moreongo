/** @ngInject */
module.exports = function(toastrConfig) {
    angular.extend(toastrConfig, {
        target: '.toastr-panel'
    });
}
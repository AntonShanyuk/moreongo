/** @ngInject */
module.exports = function ($scope, currentSession) {
    var vm = this;
    
    vm.isAuthenticated = currentSession.isAuthenticated;
    vm.organization = currentSession.organization;
}
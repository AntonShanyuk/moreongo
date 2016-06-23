/** @ngInject */
module.exports = function (session, $state, $q) {
    var vm = this;

    vm.login = function () {
        session.post({
            email: vm.email,
            password: vm.password
        }).$promise.catch(function(err){
            vm.loginFailed = true;
            return $q.reject(err);
        }).then(function () {
            $state.go('home.map.myService.meetings', {}, { reload: 'home' });
        });
    }
}
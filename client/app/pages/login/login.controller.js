/** @ngInject */
module.exports = function (session, $state) {
    var vm = this;

    vm.login = function () {
        session.post({
            email: vm.email,
            password: vm.password
        }).$promise.then(function () {
            $state.go('home.map.search', {}, { reload: 'home' });
        });
    }
}
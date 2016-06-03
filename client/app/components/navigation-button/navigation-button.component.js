require('./navigation-button.scss');
var template = require('./navigation-button.html');

module.exports = {
    restrict: 'E',
    bindings: {
        state: '@',
        classes: '@',
        title: '@'
    },
    template: template,
    controller: function($state){
        var vm = this;
        
        vm.go = function () {
            $state.go(vm.state);
        }
    },
    controllerAs: 'vm'
};
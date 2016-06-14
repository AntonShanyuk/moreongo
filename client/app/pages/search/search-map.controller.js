'use strict';

/** @ngInject */
module.exports = function(organizations, $scope){
    var vm = this;

    vm.organizations = organizations;
    vm.highlight = function(organization) {
        $scope.$emit('organization.highlight', organization._id);
    }
}
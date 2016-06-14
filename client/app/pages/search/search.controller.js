'use strict';

var _ = require('lodash');

/** @ngInject */
module.exports = function (organizations, $rootScope, $scope, $state) {
    var vm = this;

    vm.organizations = organizations;
    vm.book = function (service) {
        console.log(service);
    }

    vm.hide = function (organization) {
        organization.highlight = false;
    }

    $rootScope.$on('organization.highlight', function (event, id) {
        var highlighted = _.find(vm.organizations, { highlight: true });
        if (highlighted) {
            highlighted.highlight = false;
        }
        _.find(vm.organizations, { _id: id }).highlight = true;
        $scope.$apply();
    });

    $rootScope.$on('mapBoundsChanged', function(event, location){
        console.log(location);
    });

    $rootScope.$on('cityChanged', function(event, city){
        $state.go('home.map.search', {city: city});
    });
}
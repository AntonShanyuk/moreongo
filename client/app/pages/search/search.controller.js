'use strict';

var _ = require('lodash');
var moment = require('moment');

/** @ngInject */
module.exports = function (organizations, $rootScope, $scope, $state, location, $document) {
    var vm = this;

    vm.selectedDate = new Date();
    vm.selectedTime = moment().add({ hours: 1 }).startOf('hour');

    vm.organizations = organizations;

    vm.hide = function (organization) {
        organization.highlight = false;
    }

    vm.navigate = function (organization) {
        resetHighlight();
        organization.highlight = true;
    }

    vm.changeSelectedDateTime = function () {
        var momentTime = moment(vm.selectedTime);
        if (!momentTime.isValid()) {
            return;
        }
        vm.selectedDateTime = moment(moment(vm.selectedDate))
            .hour(momentTime.hour())
            .minute(momentTime.minute())
            .format('lll');
    }

    vm.sendRequest = function () {
        console.log(1);
    }

    init();

    var highlightEventDestructor = $rootScope.$on('organization.highlight', function (event, id) {
        var current = highlight(id);

        var container = angular.element($document[0].querySelector('.left-panel'));
        $document.scrollToElementAnimated(angular.element(container[0].querySelector('.o' + current._id)), 70);
        $scope.$apply();
    });

    var boundsChangedEventDestructor = $rootScope.$on('mapBoundsChanged', function (event, args) {
        $state.go('home.map.search', { lat: args.latitude, lng: args.longitude, city: null }, { reload: 'home.map.search' });
    });

    var zoomChangedEventDestructor = $rootScope.$on('mapZoomChanged', function (event, zoom) {
        $state.go('home.map.search', { zoom: zoom }, { reload: 'home.map.search' });
    });

    var cityChangedEventDestructor = $rootScope.$on('cityChanged', function (event, city, init) {
        if (!init) {
            $state.go('home.map.search', { city: city, lat: null, lng: null }, { reload: 'home.map.search' });
        }
    });

    $scope.$on('$destroy', function () {
        highlightEventDestructor();
        boundsChangedEventDestructor();
        zoomChangedEventDestructor();
        cityChangedEventDestructor();
    });

    function highlight(id) {
        resetHighlight();
        var current = _.find(vm.organizations, { _id: id });
        current.highlight = true;

        return current;
    }

    function resetHighlight() {
        var highlighted = _.find(vm.organizations, { highlight: true });
        if (highlighted) {
            highlighted.highlight = false;
        }
    }

    function init() {
        vm.changeSelectedDateTime();
    }
}
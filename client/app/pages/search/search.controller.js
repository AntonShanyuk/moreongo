'use strict';

var _ = require('lodash');
var moment = require('moment');

/** @ngInject */
module.exports = function (organizations, $rootScope, $scope, $state, location, $document, meeting, toastr) {
    var vm = this;

    vm.requestTime = moment().add({ hours: 1 }).startOf('hour').toDate();
    vm.requestDateChanged = function (service, date) {
        service.requestDate = date;
    }

    vm.organizations = organizations;

    vm.hide = function (organization) {
        organization.highlight = false;
    }

    vm.navigate = function (organization) {
        resetHighlight();
        organization.highlight = true;
    }

    vm.placeholderMessage = function (service) {
        var date = moment(service.requestDate || vm.requestTime).format('HH:mm');
        return 'Здравствуйте, я бы хотел к Вам записаться на ' + date + '. Альтернативное время: ';
    }

    vm.focusRequestMessage = function (service) {
        if(!service.message){
            service.message = vm.placeholderMessage(service);
        }
    }

    vm.blurRequestMessage = function(service){
        if(service.message == vm.placeholderMessage(service)){
            service.message = '';
        }
    }

    vm.sendRequest = function (organization, service) {
        meeting.post({
            organization: organization._id,
            service: service.name,
            phone: service.requestPhone,
            email: service.requestEmail,
            date: service.requestDate || vm.requestTime,
            message: service.message || vm.placeholderMessage(service)
        }).$promise.then(function () {
            toastr.success('Ожидайте подтверждение запроса по email либо по телефону', 'Запрос отправлен');
        });
    }

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
}
'use strict';

var moment = require('moment');
var _ = require('lodash');

/** @ngInject */
module.exports = function ($stateParams, meetings, $state, dateUrlFormat, myOrganization, meeting, toastr) {
    var vm = this;

    vm.moment = moment;
    vm.dateUrlFormat = dateUrlFormat;
    vm.organization = myOrganization;
    vm.currentDate = $stateParams.date || moment().format(dateUrlFormat);

    vm.meetings = meetings;
    vm.pendingRequestsExist = _.some(meetings, function(meetings, date){
        return date != $stateParams.date;
    });

    var date = $stateParams.date ? moment($stateParams.date, dateUrlFormat).hours(12) : moment().add({hours: 1}); 

    vm.date = date.startOf('hour').toDate();

    vm.dateChanged = function () {
        var date = moment(vm.date).format(dateUrlFormat);
        $state.go('home.map.myService.meetings', { date: date });
    }

    vm.createMeeting = function(meetingObject){
        return meeting.postAccepted(meetingObject).$promise.then(function(){
            return $state.reload('home.map.myService.meetings');
        }).then(function(){
            toastr.success('Запись подтверждена автоматически', 'Запись создана.');
        });
    }
}
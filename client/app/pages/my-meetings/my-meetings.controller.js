'use strict';

var moment = require('moment');
var _ = require('lodash');

/** @ngInject */
module.exports = function ($stateParams, meetings, $state, dateUrlFormat, myOrganization) {
    var vm = this;

    vm.moment = moment;
    vm.dateUrlFormat = dateUrlFormat;
    vm.organization = myOrganization;
    vm.currentDate = $stateParams.date || moment().format(dateUrlFormat);

    vm.meetings = meetings;
    vm.pendingRequestsExist = _.any(meetings, function(meeting){
        meeting.date != $stateParams.$state;
    });

    var date = $stateParams.date ? moment($stateParams.date, dateUrlFormat).hours(12) : moment().add({hours: 1}); 

    vm.date = date.startOf('hour').toDate();

    vm.dateChanged = function () {
        var date = moment(vm.date).format(dateUrlFormat);
        $state.go('home.map.myService.meetings', { date: date });
    }

    vm.meetingCreated = function(meeting){
        changeMeeting({
            id: meeting._id,
            message: 'Запись подтверждена автоматически',
            status: 'accepted'
        }, 'Запись создана со статусом "подтвержденная".');
    }
}
'use strict';

var moment = require('moment');

/** @ngInject */
module.exports = function ($stateParams, meetings, $state, dateUrlFormat, myOrganization) {
    var vm = this;

    vm.organization = myOrganization;
    vm.currentDate = $stateParams.date || moment().format(dateUrlFormat);

    vm.meetings = meetings;

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
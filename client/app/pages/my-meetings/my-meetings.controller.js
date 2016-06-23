'use strict';

var moment = require('moment');

/** @ngInject */
module.exports = function ($stateParams, meetings, meeting, $state, toastr, dateUrlFormat, myOrganization) {
    var vm = this;

    vm.organization = myOrganization;
    vm.meetings = meetings;
    vm.status = {
        pending: 'новое!',
        accepted: 'подтверждено',
        rejected: 'отклонено',
        cancelled: 'отменено'
    }

    var date = $stateParams.date ? moment($stateParams.date, dateUrlFormat).hours(12) : moment().add({hours: 1}); 

    vm.date = date.startOf('hour').toDate();

    vm.toggleResponseForm = function (meeting) {
        var id = meeting.collapsed ? meeting._id : null;
        $state.go('home.map.myService.meetings', { id: id });
    }

    vm.dateChanged = function () {
        var date = moment(vm.date).format(dateUrlFormat);
        $state.go('home.map.myService.meetings', { date: date });
    }

    vm.acceptMessage = 'Запрос подтверждаю.';
    vm.rejectMessage = 'К сожалению, не могу Вас принять в это время.';
    vm.cancelMessage = 'Ваша запись отменена.';

    vm.textareaFocus = function (meeting, modelName, defaultMessage) {
        if (!meeting[modelName]) {
            meeting[modelName] = defaultMessage;
        }
    }

    vm.textareaBlur = function (meeting, modelName, defaultMessage) {
        if (meeting[modelName] == defaultMessage) {
            meeting[modelName] = '';
        }
    }

    vm.acceptMeeting = function (meetingObject) {
        changeMeeting({
            id: meetingObject._id,
            status: 'accepted',
            message: meetingObject.acceptMessage || vm.acceptMessage
        }, 'Запрос подтвержден');
    };

    vm.cancelMeeting = function (meetingObject) {
        changeMeeting({
            id: meetingObject._id,
            status: 'cancelled',
            message: meetingObject.cancelMessage || vm.cancelMessage
        }, 'Запись отменена');
    }

    vm.rejectMeeting = function (meetingObject) {
        changeMeeting({
            id: meetingObject._id,
            status: 'rejected',
            message: meetingObject.rejectMessage || vm.rejectMessage
        }, 'Запрос отклонен');
    }

    vm.meetingCreated = function(meeting){
        changeMeeting({
            id: meeting._id,
            message: 'Запись подтверждена автоматически',
            status: 'accepted'
        }, 'Запись создана со статусом "подтвержденная".');
    }

    function changeMeeting(request, notificationMessage) {
        meeting.put(request).$promise.then(() => {
            return $state.reload('home.map.myService.meetings');
        }).then(() => {
            toastr.success('Клиенту отправлено email-уведомление', notificationMessage);
        });
    };
}
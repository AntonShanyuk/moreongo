'use strict';

/** @ngInject */
module.exports = function (meeting, toastr, $state) {
    var vm = this;

    vm.acceptMessage = 'Запрос подтверждаю.';
    vm.rejectMessage = 'К сожалению, не могу Вас принять в это время.';
    vm.cancelMessage = 'Ваша запись отменена.';
    vm.status = {
        pending: 'новое!',
        accepted: 'подтверждено',
        rejected: 'отклонено',
        cancelled: 'отменено'
    }

    vm.toggleResponseForm = function () {
        var id = vm.meeting.collapsed ? vm.meeting._id : null;
        $state.go('home.map.myService.meetings', { id: id });
    }

    vm.textareaFocus = function (modelName, defaultMessage) {
        if (!vm.meeting[modelName]) {
            vm.meeting[modelName] = defaultMessage;
        }
    }

    vm.textareaBlur = function (meeting, modelName, defaultMessage) {
        if (meeting[modelName] == defaultMessage) {
            meeting[modelName] = '';
        }
    }

    vm.acceptMeeting = function () {
        changeMeeting({
            id: vm.meeting._id,
            status: 'accepted',
            message: vm.meeting.acceptMessage || vm.acceptMessage
        }, 'Запрос подтвержден');
    };

    vm.cancelMeeting = function () {
        changeMeeting({
            id: vm.meeting._id,
            status: 'cancelled',
            message: vm.meeting.cancelMessage || vm.cancelMessage
        }, 'Запись отменена');
    }

    vm.rejectMeeting = function () {
        changeMeeting({
            id: vm.meeting._id,
            status: 'rejected',
            message: vm.meeting.rejectMessage || vm.rejectMessage
        }, 'Запрос отклонен');
    }

    function changeMeeting(request, notificationMessage) {
        meeting.put(request).$promise.then(() => {
            return $state.reload('home.map.myService.meetings');
        }).then(() => {
            toastr.success('Клиенту отправлено email-уведомление', notificationMessage);
        });
    };
}
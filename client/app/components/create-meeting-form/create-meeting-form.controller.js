'use strict';

var moment = require('moment');

/** @ngInject */
module.exports = function () {
    var vm = this;

    vm.placeholderMessage = function () {
        if (vm.customPlaceholderMessage) {
            return vm.customPlaceholderMessage;
        }
        var date = moment(vm.date).format('HH:mm');
        return 'Здравствуйте, я бы хотел к Вам записаться на ' + date + '. Альтернативное время: ';
    }

    vm.focusRequestMessage = function () {
        if (!vm.message) {
            vm.message = vm.placeholderMessage();
        }
    }

    vm.blurRequestMessage = function () {
        if (vm.message == vm.placeholderMessage()) {
            vm.message = '';
        }
    }

    vm.sendRequest = function () {
        vm.onSubmit({
            meeting: {
                organization: vm.organizationId,
                service: vm.serviceName,
                phone: vm.requestPhone,
                email: vm.requestEmail,
                date: vm.date,
                message: vm.message || vm.placeholderMessage()
            }
        });
    }
}
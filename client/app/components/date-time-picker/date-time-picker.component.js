'use strict';

require('./date-time-picker.scss');
var template = require('./date-time-picker.html');
var moment = require('moment');

module.exports = {
    restrict: 'E',
    bindings: {
        date: '<',
        dateChanged: '&'
    },
    template: template,
    /** @ngInject */
    controller: function () {
        var vm = this;

        setDate();

        vm.changeSelectedDateTime = function () {
            var momentTime = moment(vm.selectedTime);
            if (!momentTime.isValid()) {
                return;
            }

            vm.date = moment(moment(vm.selectedDate))
                .hour(momentTime.hour())
                .minute(momentTime.minute())
                .toDate();

            setDate();

            vm.dateChanged({
                date: vm.date
            });
        }

        function setDate() {
            vm.selectedDate = new Date(vm.date.getTime());
            vm.selectedTime = new Date(vm.date.getTime());
        }
    },
    controllerAs: 'vm'
}
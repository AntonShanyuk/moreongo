'use strict';

require('./date-time-picker.scss');
var template = require('./date-time-picker.html');
var moment = require('moment');

module.exports = {
    restrict: 'E',
    bindings: {
        date: '='
    },
    template: template,
    /** @ngInject */
    controller: function () {
        var vm = this;

        setDate();

        vm.dateOptions = {
            dateDisabled: function (args) {
                var now = moment().add({ hours: 1 }).startOf('hour');
                var isInPast = moment(args.date).diff(now, 'days') < 0;
                return isInPast;
            },
            showWeeks: false
        }

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
        }

        function setDate() {
            vm.selectedDate = new Date(vm.date.getTime());
            vm.selectedTime = new Date(vm.date.getTime());
        }
    },
    controllerAs: 'vm'
}
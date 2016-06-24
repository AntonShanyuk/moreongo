'use strict';

var template = require('./create-meeting-form.html');
var controller = require('./create-meeting-form.controller');

module.exports = {
    restrict: 'E',
    bindings: {
        organizationId: '<',
        serviceName: '<',
        date: '<',
        emailRequired: '<',
        customPlaceholderMessage: '@',
        onSubmit: '&'
    },
    transclude: {
        controls: '?customControls',
        submit: 'submitButton'
    },
    template: template,
    controller: controller,
    controllerAs: 'vm'
}
'use strict';

require('./manage-meeting-form.scss');
var template = require('./manage-meeting-form.html');
var controller = require('./manage-meeting-form.controller');

module.exports = {
    restrict: 'E',
    bindings: {
        meeting: '='
    },
    template: template,
    controller: controller,
    controllerAs: 'vm'
}
var $ = require('jquery');

/** @ngInject */
module.exports = function () {
    return {
        restrict: 'A',
        link: function (scope, el) {
            var $el = $(el);
            $el.on('click', function (e) {
                if ($(e.target).is('a')) {
                    $el.find('.navbar-collapse.in').removeClass('in');
                }
            });
        }
    }
}
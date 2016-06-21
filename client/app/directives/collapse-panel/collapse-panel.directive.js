var $ = require('jquery');

require('./collapse-panel.scss');
var template = require('./collapse-panel.html');

 /** @ngInject */
module.exports = function(){
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            collapsed: '='
        },
        template: template,
        link: function(scope, el){
            scope.$watch('collapsed', function(val){
                $(el).find('[panel-collapse]').toggle(!val);
            });
        }
    }
}
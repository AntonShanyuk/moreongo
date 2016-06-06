/** @ngInject */
module.exports = function($resource){
    return $resource('/api/session', {}, {
        get: {
            method: 'GET',
            cache: true
        }
    });
}
/** @ngInject */
module.exports = function($resource){
    return $resource('/api/session', {}, {
        get: {
            method: 'GET'
        },
        post: {
            method: 'POST'
        },
        delete: {
            method: 'DELETE'
        }
    });
}
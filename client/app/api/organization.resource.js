/** @ngInject */
module.exports = function($resource){
    return $resource('', {}, {
        post: {
            url: '/api/organization',
            method: 'POST'
        }
    });
}
/** @ngInject */
module.exports = function ($resource) {
    return $resource('', {}, {
        post: {
            url: '/api/organization',
            method: 'POST'
        },
        my: {
            url: '/api/my-organization',
            method: 'GET'
        },
        put: {
            url: '/api/organization/:id',
            params: { id: '@_id' },
            method: 'PUT'
        }
    });
}
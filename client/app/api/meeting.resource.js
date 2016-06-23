'use strict';

/** @ngInject */
module.exports = function ($resource) {
    return $resource('', {}, {
        post: {
            url: '/api/meeting',
            method: 'POST'
        },
        put: {
            url: '/api/meeting/:id',
            params: { id: '@id' },
            method: 'PUT'
        },
        getMy: {
            url: '/api/meetings/my',
            method: 'GET',
            isArray: true
        }
    });
}
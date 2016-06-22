'use strict';

/** @ngInject */
module.exports = function ($resource) {
    return $resource('', {}, {
        post: {
            url: '/api/meetings',
            method: 'POST'
        },
        getMy: {
            url: '/api/meetings/my',
            method: 'GET',
            isArray: true
        }
    });
}
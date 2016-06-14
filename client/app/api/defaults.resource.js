'use strict';

/** @ngInject */
module.exports = function($resource){
    return $resource('', {}, {
        get: {
            url: '/api/defaults',
            method: 'GET',
            cache: true
        }
    });
}
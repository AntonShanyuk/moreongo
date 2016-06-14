'use strict';

module.exports =
    /** @ngInject */
    function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            language: 'uk'
        });
    };
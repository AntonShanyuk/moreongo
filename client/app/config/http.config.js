'use strict';

module.exports =
    /** @ngInject */
    function ($httpProvider) {
        $httpProvider.interceptors.push(function () {
            return {
                'request': function (config) {
                    if (config.method == 'GET') {
                        if (!config.params) {
                            config.params = {};
                        }

                        config.params.d = new Date().getTime();
                    }

                    return config;
                }
            };
        })
    };
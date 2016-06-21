'use strict';

module.exports =
    /** @ngInject */
    function ($httpProvider) {
        $httpProvider.interceptors.push(
            /** @ngInject */
            function ($templateCache) {
                return {
                    'request': function (config) {
                        if (config.method == 'GET') {
                            if ($templateCache.get(config.url)) {
                                return config;
                            }
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
'use strict';

module.exports =
    /** @ngInject */
    function ($httpProvider) {
        $httpProvider.interceptors.push(
            /** @ngInject */
            function ($templateCache, $q, $injector) {
                return {
                    request: function (config) {
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
                    },
                    responseError: function (response) {
                        console.log(response);
                        if (response.status === 401) {
                            $injector.get('$state').transitionTo('home.map.login');
                        }
                        return $q.reject(response);
                    }
                };
            })
    };
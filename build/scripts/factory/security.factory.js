define(['app'], function(app) {

    'use strict';

    /* jshint browser: true */
    app.factory('Security', ['$http', '$httpParamSerializer', '$cookies', '$rootScope', '$log',
        function($http, $httpParamSerializer, $cookies, $rootScope, $log) {

            function Security(data) {
                if (data) {
                    this.setData(data);
                }
            }

            /**
             *
             * @type {{setData: Function, load: Function, update: Function, getHost: Function}}
             */
            Security.prototype = {

                setData: function(data) {
                    angular.extend(this, data);
                },

                getToken: function(username, password, callback) {

                    var requestData = {
                        grant_type: 'password',
                        username: username,
                        password: password,
                        client_id: app.CONST.OAUTH2_CLIENT_ID
                    };

                    var encoded = btoa(app.CONST.OAUTH2_CLIENT_ID + ':' + app.CONST.OAUTH2_CLIENT_SECRET);
                    alert($rootScope.getAuthHost() + '/uaa/oauth/token');
                    var request = {
                        method: 'POST',
                        url: $rootScope.getAuthHost() + '/uaa/oauth/token',
                        headers: {
                            'Authorization': 'Basic ' + encoded,
                            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
                        },
                        data: $httpParamSerializer(requestData)
                    };

                    $http(request)
                        .success(function(data, status, headers, config) {

                            $http.defaults.headers.common.Authorization = 'Bearer ' + data.access_token;
                            $cookies.put('access_token', data.access_token);

                            if (callback) {
                                callback(data, status, headers, config);
                            }

                        })
                        .error(function(data, status, headers, config) {
                            $log.error(data);
                            if (callback) {
                                callback(data, status, headers, config);
                            }

                        });
                },

                getUser: function(callback) {
                    $http.get($rootScope.getAuthHost() + '/user')
                        .success(function(data, status, headers, config) {
                            if (callback) {
                                callback(data, status, headers, config);
                            }
                        })
                        .error(function(data, status, headers, config) {
                            if (callback) {
                                callback(data, status, headers, config);
                            }
                        });
                },

                logout: function(callback) {
                    $http.get($rootScope.getAuthHost() + '/logout')
                        .success(function(data, status, headers, config) {
                            $http.defaults.headers.common.Authorization = undefined;
                            $cookies.remove('access_token');
                            if (callback) {
                                callback(data, status, headers, config);
                            }
                        })
                        .error(function(data, status, headers, config) {
                            if (callback) {
                                callback(data, status, headers, config);
                            }
                        });
                }
            };

            return Security;

        }
    ]);
});

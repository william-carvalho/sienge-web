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

                  var headers = username && password ? {authorization : "Basic "
                      + btoa(username + ":" + password)
                  } : {};

                  $http.get('', {headers : headers}).success(function(data) {
                    if (data.name) {
                      $rootScope.authenticated = true;
                    } else {
                      $rootScope.authenticated = false;
                    }
                    callback && callback();
                  }).error(function() {
                    $rootScope.authenticated = false;
                    callback && callback();
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

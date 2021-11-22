define(['i18n/language', 'app', 'lazyload', 'routes'], function (language, app) {
	
  'use strict';
  /*jshint sub:true*/
  app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
      // lazy controller, directive and service
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      app.constant = $provide.constant;
      app.value = $provide.value;
    }
  ]);

  app.config(['$stateProvider', '$provide', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $provide, $urlRouterProvider, $httpProvider) {
      // Authentication interceptor
      $provide.factory('authInterceptor', ['$rootScope', '$q', '$window', '$cookies',
        function ($rootScope, $q, $window, $cookies) {
          return {
            request: function (config) {
              config.headers = config.headers || {};
              if ($cookies.get('access_token') && $cookies.get('access_token') !== 'null') {
                config.headers['Authorization'] = 'Bearer ' + $cookies.get('access_token');
              }
              return config;
            },
            response: function (response) {
              if (response.status === 401) {
                // handle the case where the user is not authenticated
              }
              if (response.status === 400) {
                console.log('400');
              }
              return response || $q.when(response);
            }
          };
        }]);

      // Error handler interceptor
      $provide.factory('errorHandlerInterceptor', ['$rootScope', '$q',
        function ($rootScope, $q) {
          return {
            request: function (config) {
              return config;
            },
            requestError: function (rejection) {
              return rejection;
            },
            responseError: function (rejection) {
              if (rejection.status === 401) {
                if (rejection.config.url.indexOf('/login') < 0) {
                  $rootScope.$broadcast('ErrorInterceptor', 401, rejection.statusText);
                }
                return $q.reject(rejection);
              }
              if (rejection.status === 400) {
                if (rejection.config.url.indexOf('/forgetpassword') < 0) {
                  $rootScope.$broadcast('ErrorInterceptor', 400);
                }
                return $q.reject(rejection);
              }
              if (rejection.status === 404) {
                $rootScope.$broadcast('ErrorInterceptor', 404);
                return $q.reject(rejection);
              }
              if (rejection.status >= 500) {
                $rootScope.$broadcast('ErrorInterceptor', 500);
                return $q.reject(rejection);
              }
              return $q.reject(rejection);

            }
          };
        }]);

      $httpProvider.interceptors.push('authInterceptor');
      $httpProvider.interceptors.push('errorHandlerInterceptor');
    }]);

  // Translation i18n configurations
  app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('pt_BR', language.pt_BR);
    $translateProvider.translations('en_GB', language.en_GB);

    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.preferredLanguage('pt_BR');
  }]);

});

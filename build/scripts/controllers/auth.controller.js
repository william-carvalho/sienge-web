define(['run', 'factory/security.factory'], function () {

  'use strict';

  return ['$scope', '$state', '$rootScope', '$resource', '$http', '$httpParamSerializer', '$cookies', 'BaseController', 'Security',
    function ($scope, $state, $rootScope, $resource, $http, $httpParamSerializer, $cookies, BaseController, Security) {
      angular.extend($scope, BaseController);

      $scope.security = new Security();
      var timeout = 5000;
      $scope.data = {
        username: '',
        password: ''
      };

      $scope.login = function () {
        $cookies.remove('access_token');
        $scope.security.getToken($scope.data.username, $scope.data.password,
          function (data, status) {
            if (status === 200) {
              $state.go('operationdesk');
              $scope.security.getUser(function (data, status) {
                if (status === 200) {
                  localStorage.clear();
                  $rootScope.logged = true;
                  $rootScope.loggedUser = data;
                  $state.go('operationdesk');
                }
              });
            }
          });
      };

      $rootScope.$on('LOGOUT', function() {
        $http.defaults.headers.common.Authorization = undefined;
        $cookies.remove('access_token');
        $rootScope.logged = false;
        $rootScope.loggedUser = undefined;
        $state.go('login');
      });

    }];
});

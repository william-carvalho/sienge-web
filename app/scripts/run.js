define(['angularAMD', 'app', 'config'], function (angularAMD, app) {
  'use strict';
  app.run(['$rootScope', '$timeout', '$http', '$window', '$cookies', '$state',
    function ($rootScope, $timeout, $http, $window, $cookies, $state) {

      /**
       * Return the current host
       *
       * @returns {*}
       */
      $rootScope.getHost = function () {

        if (document.location.hostname === 'localhost') {
          return app.CONST.LOCALHOST;
        } else {
          return app.CONST.SERVER;
        }
      };

      /**
       * Return the current authentication host
       *
       * @returns {*}
       */
      $rootScope.getAuthHost = function () {

        if (document.location.hostname === 'localhost') {
          return app.CONST.SECURITY_LOCALHOST;
        } else {
          return app.CONST.SECURITY_SERVER;
        }
      };

      /**
       * Return the customer
       *
       * @returns {*}
       */
      $rootScope.getCustomer = function () {

        return app.CUSTOMER.ID;
      };

      /**
       * TODO: remove this function from this run.js (that should be inside of a controller class)
       */
      $rootScope.logout = function () {
        $rootScope.$broadcast('LOGOUT');
      };

    }]);

  return angularAMD.bootstrap(app);

});

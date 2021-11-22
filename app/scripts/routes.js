define(['angularAMD', 'app'], function (angularAMD, app) {

  'use strict';

  return app.config(['$stateProvider', '$provide', '$urlRouterProvider',

    function ($stateProvider, $provide, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/login');


      $stateProvider
        .state('home', angularAMD.route(
          {
            url: '/home',
            templateUrl: 'views/cliente/cliente.html',
            controllerUrl: 'controllers/cliente.controller'
          }))
        .state('login', angularAMD.route(
          {
            url: '/login',
            templateUrl: 'views/auth/login.html',
            controllerUrl: 'controllers/auth.controller'
          }))
        .state('tiporodovia', angularAMD.route(
                {
                  url: '/tiporodovia',
                  templateUrl: 'views/tiporodovia/tiporodovia.html',
                  controllerUrl: 'controllers/tiporodovia.controller'
            }))
        .state('tipoveiculo', angularAMD.route(
                    {
                      url: '/tipoveiculo',
                      templateUrl: 'views/tipoveiculo/tipoveiculo.html',
                      controllerUrl: 'controllers/tipoveiculo.controller'
            }))
        .state('veiculo', angularAMD.route(
                        {
                          url: '/veiculo',
                          templateUrl: 'views/veiculo/veiculo.html',
                          controllerUrl: 'controllers/veiculo.controller'
            }))
         .state('transporte', angularAMD.route(
                            {
                              url: '/transporte',
                              templateUrl: 'views/transporte/transporte.html',
                              controllerUrl: 'controllers/transporte.controller'
                }))
        .state('rodovia', angularAMD.route(
                    {
                      url: '/rodovia',
                      templateUrl: 'views/rodovia/rodovia.html',
                      controllerUrl: 'controllers/rodovia.controller'
            }));
    }]);

});

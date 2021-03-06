define('controllers/home.controller',['run'], function () {

    'use strict';

    return ['$scope','$rootScope','BaseController', function ($scope, $rootScope, BaseController) {

            angular.extend($scope, BaseController);

            $scope.$on('$stateChangeSuccess', function(){
                console.log('state Change Success');
            });

            /**
             * Listener when the view is loaded
             */
            $scope.$on('$viewContentLoaded', function() {
                console.log('view Content Loaded...');
            });

        }];
});


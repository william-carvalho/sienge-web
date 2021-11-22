define(['angularAMD', 'bootstrap'], function (angularAMD) {

    'use strict';

    angularAMD.directive('coreFooter', ['$timeout', '$rootScope', function ($timeout, $rootScope) {

        return {
            restrict: 'E',
            templateUrl: 'views/core/footer.html',
            controller: ['$scope', '$rootScope', function($scope, $rootScope){


            }]
        };
    }]);
});

define(['angularAMD', 'bootstrap', 'toastr'], function (angularAMD) {
    'use strict';
    angularAMD.directive('toastr', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            controller: ['$scope', '$rootScope', function($scope, $rootScope){
                $scope.toastr = $.growl;
            }]
        };
    }]);
});

define(['angularAMD', 'bootstrap', 'initial'], function (angularAMD) {
    'use strict';
    /* jshint browser: true */
    angularAMD.directive('coreHeader', ['$timeout', '$rootScope', '$window', function ($timeout, $rootScope, $window) {
        return {
            restrict: 'E',
            templateUrl: 'views/core/header.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                var window = angular.element(document);

                $scope.openNotifications = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    var actual = angular.element($event.currentTarget).parent();
                    if(!actual.is($scope.openWindow)){
                        $('.dropdown').removeClass('open');
                    }
                    $scope.openWindow = actual;
                    if($scope.openWindow.hasClass('open')){
                        $scope.openWindow.removeClass('open');
                    }
                    else{
                        $scope.openWindow.addClass('open');
                    }                    
                };

                window.click(function(e) {
                    e = angular.element(e.currentTarget);
                    if (e.parent().children('.dropdown-menu').length === 0) {
                        if (!e.hasClass('dropdown-menu') && !e.parent().hasClass('dropdown-menu')) {
                            if($scope.openWindow){
                                $scope.openWindow.removeClass('open');
                            }
                        }
                    }
                });

                if($scope.loggedUser){
                    localStorage.setItem('loggedUser', JSON.stringify($scope.loggedUser));
                }
                else{
                    $scope.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
                }

                var options = {name: $scope.loggedUser.name, width: 40, height: 40, fontSize: 18};
                angular.element('.js-user-image').each(function(){
                    if($(this).attr('src').length <= 15){
                        $(this).initial(options);
                    }
                });

                $scope.$on('$includeContentLoaded', function(event, target) {
                    setTimeout(function(){
                        angular.element('.js-initial').initial();
                    }, 1000);
                });
            }]
        };
    }]);
});

define(['angularAMD', 'bootstrap'], function (angularAMD) {
    'use strict';
    angularAMD.directive('simplesidebar', ['$timeout', '$rootScope', '$compile', function ($timeout, $rootScope, $compile) {
        return {
            templateUrl: 'views/operationdesk/sidebar.html',
            controller: ['$scope', '$rootScope', '$compile', function($scope, $rootScope, $compile){
                var path = 'views/operationdesk/';

                var opdesk = {
                    el: angular.element('.operation-desk'),
                    sidebar: angular.element('.sidebar'),
                    margin_top: 70,
                    loadedcards: 0
                };

                var c12 = 'col-sm-12',
                    c7  = 'col-sm-7',
                    c6  = 'col-sm-6';

                var hiddenm   = '__sidebar-hidden',
                    openm     = '__open',
                    selectedm = '__selected',
                    cardc     = '.big-card';

                // Listener de load ng-include
                $scope.$on('$includeContentLoaded', function(event, target){
                    target = target.split('/');
                    target = target[target.length - 1].split('.html')[0];
                    if(target === 'sidebar'){
                        opdesk.sidebar = angular.element('.sidebar');
                    }
                });

                $scope.toggleSidebar = function($event, type){
                    if($scope.isDragging === true){return;}
                    var clicked;
                    if($event instanceof jQuery){
                        clicked = $event;
                    }else{
                        clicked = angular.element($event.currentTarget);
                    }
                    if(clicked.hasClass('panel-heading')){clicked = clicked.parent();}

                    if(!type){
                        closeSidebar(clicked, type);
                    }
                    else{
                        openSidebar(clicked, type);
                    }
                };

                function closeSidebar(clicked, type){
                    opdesk.el.addClass(c12).removeClass(c7);
                    opdesk.el.find(cardc).each(function(){
                        angular.element(this).addClass(c6).removeClass(c12);
                    });
                    opdesk.sidebar.addClass(hiddenm).removeClass(openm);
                    angular.element('.' + selectedm).removeClass(selectedm);
                    setTimeout($scope.resizeCarousel, 220);
                }

                function openSidebar(clicked, type) {
                    opdesk.el.removeClass(c12).addClass(c7);
                    opdesk.el.find(cardc).each(function(){
                        angular.element(this).removeClass(c6).addClass(c12);
                    });
                    opdesk.sidebar.removeClass(hiddenm).addClass(openm);
                    angular.element('.' + selectedm).removeClass(selectedm);
                    clicked.addClass(selectedm);

                    var checkparent = type.split('-parent');

                    if(checkparent.length > 1){
                        var parent = clicked.closest('.panel');
                        var item = clicked.closest('.slide').attr('data-slide');
                        var carousel = clicked.closest('.owl-carousel');
                        parent.addClass(selectedm);
                        if(parent){
                        	clicked = parent;
                        }
                        type = checkparent[0];
                    }
                    setTimeout(function() {
                        angular.element('body').animate({
                            scrollTop: (clicked.offset().top - opdesk.margin_top)
                        });
                        populateSidebar(clicked.attr('data-id'), type);
                    }, 220);
                }

                function populateSidebar(id, type){
                    $scope.sidebarType = path + 'partials/sidebar-' + type + '.html';
                    $scope.apply();
                }

                $scope.changeSidebarPath = function(newpath){
                    if(newpath && typeof newpath === 'string'){
                        path = newpath;
                    }else{
                        console.error('New path must be string and not undefined');
                    }
                };

                $scope.apply = function(){
                    try{
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }catch(err){}
                };

                $scope.opdesk = opdesk;
            }]
        };
    }]);
});

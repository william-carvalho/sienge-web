define(['angularAMD', 'bootstrap', 'initial'], function (angularAMD) {
    'use strict';
    /* jshint shadow:true */
    angularAMD.directive('sidebar', ['$timeout', '$rootScope', '$compile', function ($timeout, $rootScope, $compile) {
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

                    if(type === 'base'){
                        if(!clicked.hasClass('panel')){
                            var parent = null;
                            parent = clicked.closest('.panel');
                            parent.addClass(selectedm);
                            clicked = parent;
                        }
                    }

                    if(type === 'contributor'){
                        var parent = clicked.closest('.panel');
                        var item = clicked.closest('.slide').attr('data-slide');
                        var carousel = clicked.closest('.owl-carousel');
                        parent.addClass(selectedm);
                        carousel.trigger('to.owl.carousel', item);
                        if(parent){
                            clicked = parent;
                        }

                        changeTop('', '', true);
                        // $scope.handleTabChange(angular.element('[data-topdefault]'));
                    }
                    else{
                        var state = clicked.attr('data-state');
                        if(!state){
                            state = angular.element(clicked.parent().find('.state:visible')[0]).attr('data-state');
                        }
                        if(type === 'base'){
                            if(state){
                                $scope.sidebarTop = undefined;
                                $scope.occurrenceType = state;
                                changeTop('sidebar-top-occurrence-' + $scope.occurrenceType, false);
                            }
                        }
                        if($scope.sidebarTop && checkparent.length > 1){
                            changeTop($scope.sidebarTop, false);
                        }
                        else{
                            var hasOccurrence = clicked.find('[data-state]');
                            if(hasOccurrence.length === 0 && !state){
                                changeTop('', '', true);
                            }
                            else{
                                if(!$scope.occurrenceType){
                                	$scope.occurrenceType = angular.element(hasOccurrence[0]).attr('data-state');
                                }
                                changeTop('sidebar-top-occurrence-' + $scope.occurrenceType, false);
                            }
                        }
                    }

                    console.log(type);

                    setTimeout(function() {
                        angular.element('body').animate({
                        	scrollTop:(clicked.offset().top - opdesk.margin_top)
                        });
                        $scope.resizeCarousel();
                        populateSidebar(clicked.attr('data-id'), type);
                        $scope.checkAllDatePickers();
                    }, 220);
                }

                function populateSidebar(id, type){
                    $scope.tabsType    = path + 'partials/sidebar-' + type + '-tabs.html';
                    $scope.sidebarType = path + 'partials/sidebar-' + type + '.html';
                    if($scope.sidebarBottom){
                        setTimeout(function() {
                            $scope.selectTab($scope.sidebarBottom);
                            $scope.sidebarBottom = undefined;
                        }, 200);
                    }
                    else{
                        $scope.selectTab('[data-default]');
                    }
                    $scope.apply();
                }

                $scope.selectTab = function(selector, datatab){
                    angular.element('.sidebar-content .active').removeClass('active');
                    if(datatab === true){
                        selector = '[data-tab="' + selector + '"]';
                    }
                    $scope.changeTabSidebar(angular.element(selector), true);
                };

                $scope.handleTabChange = function($event){
                    var clicked;
                    if($event instanceof jQuery){
                        clicked = $event;
                    }else{
                        clicked = angular.element($event.currentTarget);
                    }
                    angular.element('.__active').removeClass('__active');
                    clicked.addClass('__active');
                    changeTop(clicked.attr('data-tab'), true);
                };

                function changeTop(partial, hasTabs, hide) {
                    if(hide === true){
                        $scope.sidebarTopType = '';
                        $scope.showTabsTop = false;
                        return;
                    }
                    $scope.sidebarTopType = path + 'partials/' + partial + '.html';
                    $scope.showTabsTop = hasTabs;

                    var sidebartop = angular.element('.sidebar-top');
                    sidebartop.removeClass('__tabs');
                    if(hasTabs === true){
                        sidebartop.addClass('__tabs');
                    }
                    else{
                        sidebartop.removeClass('__tabs');
                    }
                }

                $scope.showTabsTop = false;
                $scope.occurrences = [];

                $scope.navigatePrev = function(clicked){
                    // TODO
                    console.log('prev', clicked);
                };

                $scope.navigateNext = function(clicked){
                    // TODO
                    console.log('next', clicked);
                };

                $scope.changeTabSidebar = function($event){
                    var tab;
                    if($event.currentTarget){
                        tab = angular.element($event.currentTarget);
                    }else{
                        tab = $event;
                    }

                    if(tab.attr('data-close-top') ==='true'){
                    	changeTop('', '', true);
                    }

                    tab.parent().find('.active').removeClass('active');
                    tab.addClass('active');
                    $scope.selectedSidebar = path + 'partials/' + tab.attr('data-tab') + '.html';
                    $scope.apply();
                };

                $scope.setSidebarTop = function($event, type, id, auxfunc){
                    var clicked = angular.element($event.currentTarget);
                    var st = clicked.attr('data-sidebar-top');
                    if(st){
                        $scope.sidebarTop = st;
                    }
                    else{
                        $scope.sidebarTop = undefined;
                    }

                    if(id && auxfunc){
                        $scope[auxfunc](id, $event, type);
                    }
                    else{
                        if(typeof type === 'boolean'){
                            changeTop($scope.sidebarTop, type);
                            // $scope.handleTabChange(angular.element('[data-tab="' + $scope.sidebarTop + '"]'));
                        }
                        else{
                            $scope.toggleSidebar(clicked, type);
                        }
                    }
                };

                $scope.setSidebarBottom = function(datatab, de){
                    if(de === true){
                        datatab = '[data-tab="' + datatab + '"]';
                    }
                    $scope.sidebarBottom = datatab;
                };

                $scope.resizeCarousel = function(){
                    angular.element('.slider-container').each(function(){
                        $(this).trigger('refresh.owl.carousel');
                    });
                    angular.element('.owl-carousel').each(function(){
                        $(this).trigger('refresh.owl.carousel');
                    });
                };

                $scope.changeSidebarPath = function(newpath){
                    if(newpath && typeof newpath === 'string'){
                        path = newpath;
                    }else{
                        console.error('New path must be string and not undefined');
                    }

                    console.log(path);
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

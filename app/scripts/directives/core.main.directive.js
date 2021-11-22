define(['angularAMD', 'bootstrap', 'flatpickr', 'directives/datepicker.directive', 'directives/timepicker.directive'], function (angularAMD) {

    'use strict';
    /*jshint sub:true*/
    /* jshint browser: true */
    angularAMD.directive('coreMain', ['$timeout', 'BaseController', function ($timeout, BaseController) {

        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: 'views/core/main.html',
            controller: ['$scope', '$http', '$rootScope', '$state', '$q', '$window', '$translate', '$cookies', '$localStorage',
                function ($scope, $http, $rootScope, $state, $q, $window, $translate, $cookies, $localStorage) {

                    angular.extend($scope, BaseController);

                    $scope.showHeaderForm = false;
                    $scope.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                    ];
                    /**
                    * Listener when the state is changed
                    */
                    $scope.$on('$stateChangeSuccess', function (event, toState) {
                        $scope.showHeaderForm = toState.name !== 'home';
                    }, true);

                    // add 'ie' classes to html
                    var isIE = !!navigator.userAgent.match(/MSIE/i);
                    if (isIE) {
                        angular.element($window.document.body).addClass('ie');
                    }
                    if (isSmartDevice($window)) {
                        angular.element($window.document.body).addClass('smart');
                    }

                    // config
                    $scope.app = {
                        name: 'nexti-web',
                        version: '1.0.0',
                        // for chart colors
                        color: {
                            primary: '#7266ba',
                            info: '#23b7e5',
                            success: '#27c24c',
                            warning: '#fad733',
                            danger: '#f05050',
                            light: '#e8eff0',
                            dark: '#3a3f51',
                            black: '#1c2b36'
                        },
                        settings: {
                            themeID: 1,
                            navbarHeaderColor: 'bg-white',
                            navbarCollapseColor: 'bg-white-only',
                            asideColor: 'bg-white',
                            headerFixed: true,
                            asideFixed: false,
                            asideFolded: false,
                            asideDock: false,
                            container: false
                        }
                    };

                    $scope.class = 'auto';
                    $scope.changeClassNav = function () {
                        if ($scope.class === 'active') {
                            $scope.class = '';
                        } else {
                            $scope.class = 'active';
                        }
                    };

                    $scope.toggleNavSidebar = function () {
                        $scope.app.settings.asideFolded = !$scope.app.settings.asideFolded;
                        var c = angular.element('.owl-carousel');
                        var c2 = angular.element('.slider-container');
                        setTimeout(function () {
                            c.each(function () {
                                $(this).trigger('refresh.owl.carousel');
                            });
                            c2.each(function () {
                                $(this).trigger('refresh.owl.carousel');
                            });
                        }, 200);
                    };

                    // save settings to local storage
                    if (angular.isDefined($localStorage.settings)) {
                        $scope.app.settings = $localStorage.settings;
                    } else {
                        $localStorage.settings = $scope.app.settings;
                    }
                    $scope.$watch('app.settings', function () {
                        if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                            // aside dock and fixed must set the header fixed.
                            $scope.app.settings.headerFixed = true;
                        }
                        // for box layout, add background image
                        if ($scope.app.settings.container) {
                            angular.element('html').addClass('bg');
                        } else {
                            angular.element('html').removeClass('bg');
                        }
                        // save to local storage
                        $localStorage.settings = $scope.app.settings;
                    }, true);

                    $scope.page = 0;
                    $scope.size = 10;
                    $scope.sortOrder = 'desc';
                    $scope.sortType = 'id';
                    $scope.sort = 'id,desc';
                    $scope.searchAll = '';

                    var tabcontent;

                    $scope.onLoadAdd = function () {
                        angular.element('.crud_add').removeClass('__hidden');
                        if ($scope.editingId) {
                            angular.element('.btn-delete').show();
                        }
                        else {
                            angular.element('.btn-delete').hide();
                        }

                        tabcontent = angular.element('.tab-content');
                        $scope.activetab = tabcontent.attr('data-tab');
                        tabcontent.each(function () {
                            angular.element(this).children('[data-tab]').hide();
                        });
                        tabcontent.each(function () {
                            angular.element(this).children().filter('[data-tab="' + $scope.activetab + '"]').show();
                        });
                        apply();
                    };

                    $scope.changeTab = function ($event) {
                        var tab = angular.element($event.currentTarget);
                        $scope.activetab = tab.attr('data-tab');
                        angular.element('.nav .active').removeClass('active');
                        tab.parent().addClass('active');

                        tabcontent = angular.element('.tab-content');

                        tabcontent.children().hide();
                        tabcontent.children().filter('[data-tab="' + $scope.activetab + '"]').show();
                    };

                    $scope.showexclusionmodal = function () {
                        $scope.modalURL = 'views/crud/exclusion_modal.html';
                        angular.element('.app-modal').removeClass('__hidden');
                    };

                    $scope.hasLogo = function (customer) {
                        if (customer.logo === null || !customer.logo) {
                            customer.logo = 'images/company-placeholder.png';
                        }
                        return true;
                    };

                    $scope.sizes = [
                        { name: '10 linhas', size: 10 },
                        { name: '25 linhas', size: 25 },
                        { name: '50 linhas', size: 50 },
                        { name: '100 linhas', size: 100 }
                    ];

                    $scope.sizesSelect = $scope.sizes[0];

                    // angular translate
                    $scope.lang = { isopen: false };
                    $scope.langs = { pt_BR: 'Portugues' };
                    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || 'Portugues';
                    $scope.setLang = function (langKey, $event) {
                        // set the current lang
                        $scope.selectLang = $scope.langs[langKey];
                        // You can change the language during runtime
                        $translate.use(langKey);
                        $scope.lang.isopen = !$scope.lang.isopen;
                    };

                    function apply() {
                        try {
                            if (!$scope.$$phase) {
                                $scope.$apply();
                            }
                        } catch (err) { }
                    }

                    function isSmartDevice($window) {
                        // Adapted from http://www.detectmobilebrowsers.com
                        var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                        // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                        return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
                    }

                    $scope.checkAllDatePickers = function () {
                        $('[data-datepicker]').each(function () {
                            var datepicker = $(this).attr('data-datepicker');
                            if (!$scope[datepicker]) {
                                $scope[datepicker] = new Date();
                            }
                            if (!$scope[datepicker + '_status']) {
                                $scope[datepicker + '_status'] = false;
                            }
                        });
                    };

                    $scope.openDatePicker = function ($event) {
                        var thisel = $($event.currentTarget);
                        var dateinput = thisel.closest('.input-group').find('[data-datepicker]');
                        var statusstring = dateinput.attr('data-datepicker') + '_status';
                        $scope[statusstring] = true;
                    };

                    $scope.dateOptions = {
                        dateDisabled: false,
                        formatYear: 'yyyy',
                        maxDate: null,
                        minDate: null,
                        startingDay: 1
                    };

                    $scope.setDate = function (year, month, day) {
                        $scope.dt = new Date(year, month, day);
                    };

                    function disabled(data) {
                        var date = data.date,
                            mode = data.mode;
                        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
                    }
                }
            ],
            link: function (scope, element, attrs) {


            }
        };
    }]);
});

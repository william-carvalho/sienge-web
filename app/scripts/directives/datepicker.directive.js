define(['angularAMD', 'bootstrap', 'flatpickr_pt'], function (angularAMD) {
    'use strict';
    angularAMD.directive('datepicker', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            templateUrl: 'views/core/datepicker.html',
            link: function ($scope, element, attrs) {

            },
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.checkDatePicker = function () {
                    flatpickr('.flatpickr', {
                        wrap: true,
                        clickOpens: false,
                        time_24hr: true,
                        locale: 'pt',
                        dateFormat: 'd/m/Y',
                        onChange: bindToModel
                    });
                };

                function bindToModel(a, b, e) {
                    var dtp = $(e.element).parent();
                    if (dtp.attr('ng-model')) {
                        if ($scope[dtp.attr('ng-model')]) {
                            $scope[dtp.attr('ng-model')] = new Date(a);
                        }
                        else {
                            console.warn('Model ' + dtp.attr('ng-model') + ' is undefined.');
                        }
                    }
                }

                (function checkModels() {
                    setTimeout(function () {
                        $('datepicker').each(function () {
                            var item = $(this);
                            var model = item.attr('ng-model');
                            if (model) {
                                if ($scope[model]) {
                                    var date = new Date($scope[model]);
                                    var filterdate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                                    item.find('input').val(filterdate);
                                }
                                else {
                                    console.warn('Model ' + model + ' is undefined.');
                                }
                            }
                        });
                    }, 0);
                })();
            }]
        };
    }]);
});

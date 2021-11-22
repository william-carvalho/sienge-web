define(['angularAMD', 'bootstrap', 'flatpickr_pt'], function (angularAMD) {
    'use strict';
    angularAMD.directive('timepicker', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
        return {
            templateUrl: 'views/core/timepicker.html',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
                $scope.checkTimePicker = function () {
                    flatpickr('.timepicker', {
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true,
                        allowInput: true,
                        locale: 'pt',
                        onChange: bindToModel,
                        onClose: checkInput
                    });
                };

                function bindToModel(a, b, e) {
                    var tp = $(e.element).parent();
                    if (tp.attr('ng-model')) {
                        if ($scope[tp.attr('ng-model')]) {
                            $scope[tp.attr('ng-model')] = new Date(a);
                        }
                        else {
                            console.warn('Model ' + tp.attr('ng-model') + ' is undefined.');
                        }
                    }
                }

                function checkInput(a, b, c){
                    c.setDate($(c.input).val());
                }

                (function checkModels() {
                    setTimeout(function () {
                        $('timepicker').each(function () {
                            var item = $(this);
                            var model = item.attr('ng-model');
                            if (model) {
                                if ($scope[model]) {
                                    var date = new Date($scope[model]);
                                    var filterdate = date.getUTCHours() + ':' + date.getUTCMinutes();
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

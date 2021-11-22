define(['angularAMD', 'bootstrap', 'factory/client.factory', 'factory/workplace.factory', 'factory/person.factory', 'factory/businessunit.factory'], function (angularAMD) {
    'use strict';
    angularAMD.directive('searchfilter', ['$timeout', '$rootScope', '$compile', 'Client', 'Workplace', 'Person', 'BusinessUnit', function ($timeout, $rootScope, $compile, Client, Workplace, Person, BusinessUnit) {
        return {
            templateUrl: 'views/core/search-filter.html',
            controller: ['$scope', '$rootScope', '$compile', function($scope, $rootScope, $compile){

                var target;
                var clients = new Client();
                var workplaces = new Workplace();
                var persons = new Person();
                var businessUnits = new BusinessUnit();

                // Listener de load ng-include
                $scope.$on('$includeContentLoaded', function(event, target){
                    target = target.split('/');
                    target = target[target.length - 1].split('.html')[0];
                });

                $scope.showSearchFilter = function($event) {
                    if(!$scope.filterEl){
                        $scope.filterEl = angular.element('.filter_item')[0].outerHTML;
                    }

                    angular.element('.filter_item').remove();
                    angular.element('.search_filter').removeClass('__hidden');
                    $scope.filterReq = {
                        customerId: $rootScope.getCustomer(),
                        clientIds: [],
                        workplaceIds: [],
                        businessUnitIds: [],
                        personIds: []
                    };
                };

                // $scope.applyFilter = function($event) {
                //     //aplicar mudancas
                //     $scope.closeModal($event);
                // };

                $scope.closeModal = function($event) {
                    angular.element('.search_filter').addClass('__hidden');
                };

                $scope.apply = function(){
                    try{
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }catch(err){}
                };

                $scope.selectedClient = null;
                $scope.fClient = null;
                clients.list(0, 10, 'id,asc', function(data) {
                    var fClient = [];
                    if (data.content !== null && data.content !== '' && data.content) {
                        for (var i = 0; i < data.content.length; i += 1) {
                            fClient.push({'id': data.content[i].id, 'name': data.content[i].name});
                        }
                    }
                    $scope.fClient = fClient;
                    $scope.allClients = fClient;
                });

                $scope.listAllClient = function(val) {
                    var fClient = [];
                    if (val !== null && val !== '' && val) {
                        return clients.listAll(0, 10, 'id,asc', val, function(data) {
                            if (data.content !== null && data.content !== '' && data.content) {
                                for (var i = 0; i < data.content.length; i += 1) {
                                    fClient.push({'id': data.content[i].id, 'name': data.content[i].name});
                                }
                            }
                            $scope.fClient = fClient;
                            return fClient;
                        });
                    }
                    else{
                        $scope.fClient = $scope.allClients;
                    }
                };

                $scope.onSelectClient = function(item, model, label){
                    if(angular.element('[data-id="' + item.id + '"][data-type="client"]').length === 0){
                        $scope.filterReq.clientIds.push(item.id);
                        var filter = $scope.filterEl.replace('{main_label}', item.name);
                        filter = filter.replace('{data_fafa}', 'fa fa-building');
                        filter = filter.replace('{second_label}', '');
                        filter = filter.replace('{data_id}', item.id);
                        filter = filter.replace('{data_type}', 'client');
                        $('.filter_container .filters').append(filter);
                    }
                };



                $scope.selectedWorkplace = null;
                $scope.fWorkplace = null;
                workplaces.list(0, 10, 'id,asc', function(data) {
                    var fWorkplace = [];
                    if (data.content !== null && data.content !== '' && data.content) {
                        for (var i = 0; i < data.content.length; i += 1) {
                            fWorkplace.push({'id': data.content[i].id, 'name': data.content[i].name});
                        }
                    }
                    console.log(fWorkplace);
                    $scope.fWorkplace = fWorkplace;
                    $scope.allWorkplaces = fWorkplace;
                });

                $scope.listAllWorkplace = function(val) {
                    var fWorkplace = [];
                    if (val !== null && val !== '' && val) {
                        return workplaces.listAll(0, 10, 'id,asc', val, function(data) {
                            if (data.content !== null && data.content !== '' && data.content) {
                                for (var i = 0; i < data.content.length; i += 1) {
                                    fWorkplace.push({'id': data.content[i].id, 'name': data.content[i].name});
                                }
                            }
                            console.log(fWorkplace);
                            $scope.fWorkplace = fWorkplace;
                            return fWorkplace;
                        });
                    }
                    else{
                        $scope.fWorkplace = $scope.allWorkplaces;
                    }
                };

                $scope.onSelectWorkplace = function(item, model, label){
                    if(angular.element('[data-id="' + item.id + '"][data-type="workplace"]').length === 0){
                        $scope.filterReq.workplaceIds.push(item.id);
                        var filter = $scope.filterEl.replace('{main_label}', item.name);
                        filter = filter.replace('{data_fafa}', 'fa fa-home');
                        filter = filter.replace('{second_label}', '');
                        filter = filter.replace('{data_id}', item.id);
                        filter = filter.replace('{data_type}', 'workplace');
                        $('.filter_container .filters').append(filter);
                    }
                };

                $scope.selectedPerson = null;
                $scope.fPerson = null;
                persons.list(0, 10, 'id,asc', function(data) {
                    var fPerson = [];
                    if (data.content !== null && data.content !== '' && data.content) {
                        for (var i = 0; i < data.content.length; i += 1) {
                            fPerson.push({'id': data.content[i].id, 'name': data.content[i].name});
                        }
                    }
                    $scope.fPerson = fPerson;
                    $scope.allPersons = fPerson;
                });

                $scope.listAllPerson = function(val) {
                    var fPerson = [];
                    if (val !== null && val !== '' && val) {
                        return persons.listAll(0, 10, 'id,asc', val, function(data) {
                            if (data.content !== null && data.content !== '' && data.content) {
                                for (var i = 0; i < data.content.length; i += 1) {
                                    fPerson.push({'id': data.content[i].id, 'name': data.content[i].name});
                                }
                            }
                            $scope.fPerson = fPerson;
                            return fPerson;
                        });
                    }
                    else{
                        $scope.fPerson = $scope.allPersons;
                    }
                };

                $scope.onSelectPerson = function(item, model, label){
                    if(angular.element('[data-id="' + item.id + '"][data-type="person"]').length === 0){
                        $scope.filterReq.personIds.push(item.id);
                        var filter = $scope.filterEl.replace('{main_label}', item.name);
                        filter = filter.replace('{data_fafa}', 'fa fa-user');
                        filter = filter.replace('{second_label}', '');
                        filter = filter.replace('{data_id}', item.id);
                        filter = filter.replace('{data_type}', 'person');
                        $('.filter_container .filters').append(filter);
                    }
                };

                $scope.selectedBusinessUnit = null;
                $scope.fBusinessUnit = null;
                businessUnits.list(0, 10, 'id,asc', function(data) {
                    var fBusinessUnit = [];
                    if (data.content !== null && data.content !== '' && data.content) {
                        for (var i = 0; i < data.content.length; i += 1) {
                            fBusinessUnit.push({'id': data.content[i].id, 'name': data.content[i].name});
                        }
                    }
                    $scope.fBusinessUnit = fBusinessUnit;
                    $scope.allBusinessUnits = fBusinessUnit;
                });

                $scope.listAllBusinessUnit = function(val) {
                    var fBusinessUnit = [];
                    if (val !== null && val !== '' && val) {
                        return businessUnits.listAll(0, 10, 'id,asc', val, function(data) {
                            if (data.content !== null && data.content !== '' && data.content) {
                                for (var i = 0; i < data.content.length; i += 1) {
                                    fBusinessUnit.push({'id': data.content[i].id, 'name': data.content[i].name});
                                }
                            }
                            $scope.fBusinessUnit = fBusinessUnit;
                            return fPerson;
                        });
                    }
                    else{
                        $scope.fBusinessUnit = $scope.allBusinessUnits;
                    }
                };

                $scope.onSelectBusinessUnit = function(item, model, label){
                    if(angular.element('[data-id="' + item.id + '"][data-type="businessUnit"]').length === 0){
                        $scope.filterReq.businessUnitIds.push(item.id);
                        var filter = $scope.filterEl.replace('{main_label}', item.name);
                        filter = filter.replace('{data_fafa}', 'fa fa-map-marker');
                        filter = filter.replace('{second_label}', '');
                        filter = filter.replace('{data_id}', item.id);
                        filter = filter.replace('{data_type}', 'businessUnit');
                        $('.filter_container .filters').append(filter);
                    }
                };

                var delay = (function() {
                    var timer = 0;
                    return function(callback, ms) {
                        clearTimeout(timer);
                        timer = setTimeout(callback, ms);
                    };
                })();
            }]
        };
    }]);
});

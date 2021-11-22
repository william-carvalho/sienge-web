define(['run', 'factory/transporte.factory', 'factory/veiculo.factory', 'factory/rodovia.factory'], function() {

    'use strict';

    return ['$scope', '$rootScope', '$stateParams', '$state', 'BaseController', 'Transporte', 'Veiculo', 'Rodovia',
        function($scope, $rootScope, $stateParams, $state, BaseController, Transporte, Veiculo, Rodovia) {

          console.log('Carregou controller');

            angular.extend($scope, BaseController);

            console.log('Transporte Controller Loaded');
            $scope.transporte = new Transporte();
            $scope.newtransporte = new Transporte();

            $scope.veiculo = new Veiculo();
            $scope.newveiculo = new Veiculo();

            $scope.rodovia = new Rodovia();
            $scope.newrodovia = new Rodovia();

            $scope.page = 0;
            $scope.size = 10;
            $scope.sortOrder = 'desc';
            $scope.sortType = 'descricao';
            $scope.sort = 'descricao,asc';
            $scope.searchAll = '';


            $scope.dataVeiculo = {
                model: null,
                availableOptions: []
            };

            $scope.dataRodovia = {
                model: null,
                availableOptions: []
            };

            $scope.dataRodovias = {
                model: null,
                availableOptions: []
            };

            $scope.getList = function(value) {
                if ($scope.searchAll !== null && $scope.searchAll !== '' && $scope.searchAll !== undefined) {
                    if (value === 'recalculatePageCounter') {
                        $scope.transporte.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.transporte.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePages);
                    }
                } else {
                    if (value === 'recalculatePageCounter') {
                        $scope.transporte.list($scope.page, $scope.size, $scope.sort, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.transporte.list($scope.page, $scope.size, $scope.sort, recalculatePages);
                    }
                }
            };

            $scope.$on('$stateChangeSuccess', function(event, toState) {
                console.log('state Change Success');
                if (toState.name === 'transporte') {
                    $scope.getList('recalculatePages');
                } else if (toState.name === 'transporte_edit') {
                    $scope.transporte.load($stateParams.id);
                }
            });

            $scope.$on('$viewContentLoaded', function() {
                console.log('View Content Loaded');
            });

            $scope.editTransporte = function(id) {
              console.log(id);
                $scope.editingId = id;
                $scope.transporte.load(id, function(data) {
                    $scope.newtransporte = data;
                    $scope.showAdd('update');
                });
            };

            $scope.listAll = function(value) {

                $scope.searchAll = value;
                $scope.getList('recalculatePages');

            };

            $scope.addRodovias = function() {
              if($scope.dataRodovia.model && $scope.newtransporte.distancia){
                $scope.dataRodovia.model.distancia = $scope.newtransporte.distancia;
                $scope.dataRodovias.availableOptions.push($scope.dataRodovia.model);
              }else{
                  showStatus('Erro: valores inválidos', 'error', 5000);
              }

            };

            $scope.removeRodovias = function (id) {
                for (var i = 0; i < $scope.dataRodovias.availableOptions.length; i += 1) {

                    if ($scope.dataRodovias.availableOptions[i].id === id) {
                        $scope.dataRodovias.availableOptions.splice(i, 1);
                    }
                }
            };

            $scope.delete = function(id) {
                $scope.transporte.delete(id, function(data, status) {
                    if (status === 200) {
                        showStatus('Transporte excluído com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.save = function() {
                $scope.transporte.save($scope.newtransporte, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Transporte adicionada com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.update = function() {
              console.log($scope.newtransporte);
                $scope.transporte.update($scope.newtransporte, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Transporte atualizada com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.saveTransporte = function() {

              if($scope.dataVeiculo.model && $scope.dataRodovias.availableOptions && $scope.dataRodovias.availableOptions.length > 0){
              $scope.newtransporte.transporte.veiculo = $scope.dataVeiculo.model;
              $scope.newtransporte.rodovia = $scope.dataRodovias.availableOptions;
                if ($scope.editingId) {
                    $scope.update();
                } else {
                    $scope.save();
                }

              }else{
                  showStatus('Erro: valores inválidos!', 'error', 5000);
              }
            };

            $scope.changePage = function(page) {
                if (page === 'prev') {
                    $scope.page = $scope.page - 1;
                }
                if (page === 'next') {
                    $scope.page = $scope.page + 1;
                }
                if (typeof page === 'number') {
                    $scope.page = page - 1;
                }

                if ($scope.page < 0) {
                    $scope.page = 0;
                }
                if ($scope.page > $scope.pageslength.length - 1) {
                    $scope.page = $scope.pageslength.length - 1;
                }

                console.log(page, $scope.page);

                $scope.getList('recalculatePageCounter');
            };


            $scope.changeSize = function(size) {
                console.log(size);
                $scope.size = size.size;
                $scope.sizesSelect = size;

                $scope.getList('recalculatePages');
            };

            $scope.changeSort = function(type) {
                console.log(type);
                if ($scope.sortOrder === 'desc') {
                    $scope.sortOrder = 'asc';
                } else {
                    $scope.sortOrder = 'desc';
                }

                $scope.sortType = type;

                $scope.sort = $scope.sortType + ',' + $scope.sortOrder;

                $scope.getList('recalculatePages');

            };

            $scope.sizes = [{
                name: '10 linhas',
                size: 10
            }, {
                name: '25 linhas',
                size: 25
            }, {
                name: '50 linhas',
                size: 50
            }, {
                name: '100 linhas',
                size: 100
            }];

            $scope.sizesSelect = $scope.sizes[0];

            $scope.showAdd = function() {
                hideStatus(0);
                $scope.templateURL = 'views/transporte/transporte_add.html';
                $scope.onLoadAdd();
            };

            $scope.onLoadAdd = function() {
                setTimeout(function() {
                    angular.element('.crud_add').removeClass('__hidden');
                    if ($scope.editingId) {
                        angular.element('.btn-delete').show();
                    } else {
                        angular.element('.btn-delete').hide();
                    }
                    $scope.$apply();
                }, 100);
            };

            $scope.hideAdd = function() {
                angular.element('.crud_add').addClass('__hidden');
                setTimeout(function() {
                    $scope.templateURL = '';
                    $scope.editingId = undefined;
                    $scope.newtransporte = {};
                }, 200);
            };

            $scope.showexclusionmodal = function(id) {
                $scope.editingId = id;
                $scope.modalURL = 'views/crud/exclusion_modal.html';
                angular.element('.app-modal').removeClass('__hidden');
            };

            $scope.confirmExclusion = function() {
                $scope.modalURL = '';
                $scope.delete($scope.editingId);
                angular.element('.app-modal').addClass('__hidden');
                $scope.hideAdd();
            };

            $scope.cancelExclusion = function() {
                $scope.modalURL = '';
                angular.element('.app-modal').addClass('__hidden');
            };

            $scope.hasLogo = function(transporte) {
                if (transporte.logo === null || !transporte.logo) {
                    transporte.logo = 'images/company-placeholder.png';
                }
                return true;
            };

            $scope.showVeiculo = function () {
            $scope.dataVeiculo = [];
            $scope.dataVeiculo.availableOptions = [];
            $scope.veiculo.list(0, 50, 'id,ASC', function (data, status) {
                if (status === 200 || status === 201) {
                      $scope.dataVeiculo.availableOptions = data.content;

                    if ($scope.newtransporte.tipoTransporte) {
                        setTimeout(function () {
                            $scope.dataVeiculo.model = $scope.dataVeiculo.availableOptions[$scope.dataVeiculo.availableOptions.findIndex(checkVeiculo)];

                        }, 150);
                    }

                } else {
                    $scope.notifications.show($filter('translate')('ERRO_SEARCH') + ' ' + data.message, 'error', 5000);
                }
            });
        };

        $scope.showRodovia = function () {
        $scope.dataRodovia = [];
        $scope.dataRodovia.availableOptions = [];
        $scope.rodovia.list(0, 50, 'id,ASC', function (data, status) {
            if (status === 200 || status === 201) {
                  $scope.dataRodovia.availableOptions = data.content;


            } else {
                $scope.notifications.show($filter('translate')('ERRO_SEARCH') + ' ' + data.message, 'error', 5000);
            }
        });
    };

        function checkVeiculo(el) {
          return el.id === $scope.newtransporte.tipoTransporte.id;
        }


            function showStatus(msg, type, time) {
                $scope.statusdiv = angular.element('.status_msg');
                $scope.status_message = msg;
                $scope.statusdiv.removeClass('__hidden');
                if (type === 'error') {
                    $scope.status_msg_class = '__error';
                } else {
                    $scope.status_msg_class = '__success';
                }
                hideStatus(time);
            }

            function hideStatus(time) {
                setTimeout(function() {
                    angular.element('.status_msg').addClass('__hidden');
                    $scope.status_msg_class = '';
                    $scope.$apply();
                }, time);
            }

            function recalculatePages() {
                var pagesize = $scope.transporte.totalPages;
                $scope.pageslength = new Array(pagesize);
                for (var c = 0; c < $scope.pageslength.length; c += 1) {
                    $scope.pageslength[c] = c + 1;
                }
                recalculatePageCounter();
            }

            function recalculatePageCounter() {
                var totalofpage = $scope.size * ($scope.page + 1);
                var paginationmin = 1 + ($scope.size * $scope.page);
                if (totalofpage > $scope.transporte.totalElements) {
                    totalofpage = $scope.transporte.totalElements;
                }
                $scope.totalElements = $scope.transporte.totalElements;
                $scope.pagesCounter = paginationmin + ' - ' + totalofpage;
                if ($scope.page + 1 > $scope.transporte.totalPages) {
                    $scope.changePage($scope.page);
                    return;
                }
            }

        }
    ];
});

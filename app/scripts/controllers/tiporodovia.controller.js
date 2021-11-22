define(['run', 'factory/tiporodovia.factory'], function() {

    'use strict';

    return ['$scope', '$rootScope', '$stateParams', '$state', 'BaseController', 'TipoRodovia',
        function($scope, $rootScope, $stateParams, $state, BaseController, TipoRodovia) {

          console.log('Carregou controller');

            angular.extend($scope, BaseController);

            console.log('TipoRodovia Controller Loaded');
            $scope.tiporodovia = new TipoRodovia();
            $scope.newtiporodovia = new TipoRodovia();

            $scope.page = 0;
            $scope.size = 10;
            $scope.sortOrder = 'desc';
            $scope.sortType = 'descricao';
            $scope.sort = 'descricao,asc';
            $scope.searchAll = '';

            $scope.getList = function(value) {
                if ($scope.searchAll !== null && $scope.searchAll !== '' && $scope.searchAll !== undefined) {
                    if (value === 'recalculatePageCounter') {
                        $scope.tiporodovia.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.tiporodovia.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePages);
                    }
                } else {
                    if (value === 'recalculatePageCounter') {
                        $scope.tiporodovia.list($scope.page, $scope.size, $scope.sort, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.tiporodovia.list($scope.page, $scope.size, $scope.sort, recalculatePages);
                    }
                }
            };

            $scope.$on('$stateChangeSuccess', function(event, toState) {
                console.log('state Change Success');
                if (toState.name === 'tiporodovia') {
                    $scope.getList('recalculatePages');
                } else if (toState.name === 'tiporodovia_edit') {
                    $scope.tiporodovia.load($stateParams.id);
                }
            });

            $scope.$on('$viewContentLoaded', function() {
                console.log('View Content Loaded');
            });

            $scope.editTipoRodovia = function(id) {
              console.log(id);
                $scope.editingId = id;
                $scope.tiporodovia.load(id, function(data) {
                    $scope.newtiporodovia = data;
                    $scope.showAdd('update');
                });
            };

            $scope.listAll = function(value) {

                $scope.searchAll = value;
                $scope.getList('recalculatePages');

            };

            $scope.delete = function(id) {
                $scope.tiporodovia.delete(id, function(data, status) {
                    if (status === 200) {
                        showStatus('Tipo rodovia excluída com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.save = function() {
                $scope.tiporodovia.save($scope.newtiporodovia, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Tipo Rodovia adicionado com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.update = function() {
              console.log($scope.newtiporodovia);
                $scope.tiporodovia.update($scope.newtiporodovia, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Tipo Rodovia atualizado com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.saveTipoRodovia = function() {

                if ($scope.editingId) {
                    $scope.update();
                } else {
                    $scope.save();
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
                $scope.templateURL = 'views/tiporodovia/tiporodovia_add.html';
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
                    $scope.newtiporodovia = {};
                }, 200);
            };

            $scope.showexclusionmodal = function() {
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

            $scope.hasLogo = function(tiporodovia) {
                if (tiporodovia.logo === null || !tiporodovia.logo) {
                    tiporodovia.logo = 'images/company-placeholder.png';
                }
                return true;
            };

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
                var pagesize = $scope.tiporodovia.totalPages;
                $scope.pageslength = new Array(pagesize);
                for (var c = 0; c < $scope.pageslength.length; c += 1) {
                    $scope.pageslength[c] = c + 1;
                }
                recalculatePageCounter();
            }

            function recalculatePageCounter() {
                var totalofpage = $scope.size * ($scope.page + 1);
                var paginationmin = 1 + ($scope.size * $scope.page);
                if (totalofpage > $scope.tiporodovia.totalElements) {
                    totalofpage = $scope.tiporodovia.totalElements;
                }
                $scope.totalElements = $scope.tiporodovia.totalElements;
                $scope.pagesCounter = paginationmin + ' - ' + totalofpage;
                if ($scope.page + 1 > $scope.tiporodovia.totalPages) {
                    $scope.changePage($scope.page);
                    return;
                }
            }

        }
    ];
});

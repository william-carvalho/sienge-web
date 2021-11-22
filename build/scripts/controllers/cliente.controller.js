define('factory/cliente.factory',['app'], function(app) {

    'use strict';

    app.factory('Cliente', ['$http', '$rootScope', '$log', function($http, $rootScope, $log) {

        /**
         * @constructor
         */
        function Cliente(data) {

            if (data) {
                this.setData(data);
            }
        }

        /**
         *
         * @type {{setData: Function, load: Function, update: Function, getHost: Function}}
         */
        Cliente.prototype = {
            setData: function(data) {
                angular.extend(this, data);
            },
            list: function(page, size, sort, callback) {
                var self = this;
                $http.get($rootScope.getHost() + '/core/cliente' + '?page=' + page + '&size=' + size + '&sort=' + sort)
                    .success(function(data, status, headers, config) {
                        self.setData(data);
                        $rootScope.$broadcast('Cliente_LISTED');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $log.error(data);
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    });
            },
            listAll: function(page, size, sort, value, callback) {
                var self = this;
                $http.get($rootScope.getHost() + '/core/cliente/all/' + value + '/?page=' + page + '&size=' + size + '&sort=' + sort)
                    .success(function(data, status, headers, config) {
                        self.setData(data);
                        $rootScope.$broadcast('Cliente_LISTED');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $log.error(data);
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    });
            },
            load: function(id, callback) {
                var self = this;
                $http.get($rootScope.getHost() + '/core/cliente/' + id)
                    .success(function(data, status) {
                        self.setData(data);
                        if (callback) {
                            callback(data, status);
                        }
                    })
                    .error(function(message) {
                        $log.error(message);
                    });
            },
            update: function(model, callback) {
                $http.put($rootScope.getHost() + '/core/cliente/' + model.id, model)
                    .success(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Cliente_UPDATED');
                    })
                    .error(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Cliente_UPDATED_ERROR');
                    });
            },
            save: function(model, callback) {
                $http.post($rootScope.getHost() + '/core/cliente/', model)
                    .success(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Cliente_SAVED');
                    })
                    .error(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Cliente_SAVED_ERROR');
                    });
            },
            delete: function(id, callback) {
                $http.delete($rootScope.getHost() + '/core/cliente/' + id)
                    .success(function(data, status, headers, config) {
                        $rootScope.$broadcast('Cliente_DELETED');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $rootScope.$broadcast('Cliente_DELETED_ERROR');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    });
            }
        };

        return Cliente;

    }]);
});

define('controllers/cliente.controller',['run', 'factory/cliente.factory'], function() {

    'use strict';

    return ['$scope', '$rootScope', '$stateParams', '$state', 'BaseController', 'Cliente',
        function($scope, $rootScope, $stateParams, $state, BaseController, Cliente) {

            angular.extend($scope, BaseController);

            console.log('Cliente Controller Loaded');
            $scope.cliente = new Cliente();
            $scope.newcliente = new Cliente();

            $scope.page = 0;
            $scope.size = 10;
            $scope.sortOrder = 'desc';
            $scope.sortType = 'nome';
            $scope.sort = 'nome,desc';
            $scope.searchAll = '';

            $scope.getList = function(value) {
                if ($scope.searchAll !== null && $scope.searchAll !== '' && $scope.searchAll !== undefined) {
                    if (value === 'recalculatePageCounter') {
                        $scope.cliente.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.cliente.listAll($scope.page, $scope.size, $scope.sort, $scope.searchAll, recalculatePages);
                    }
                } else {
                    if (value === 'recalculatePageCounter') {
                        $scope.cliente.list($scope.page, $scope.size, $scope.sort, recalculatePageCounter);
                    } else if (value === 'recalculatePages') {
                        $scope.cliente.list($scope.page, $scope.size, $scope.sort, recalculatePages);
                    }
                }
            };

            $scope.$on('$stateChangeSuccess', function(event, toState) {
                console.log('state Change Success');
                if (toState.name === 'cliente') {
                    $scope.getList('recalculatePages');
                } else if (toState.name === 'cliente_edit') {
                    $scope.cliente.load($stateParams.id);
                }
            });

            $scope.$on('$viewContentLoaded', function() {
                console.log('View Content Loaded');
            });

            $scope.editCliente = function(id) {
                $scope.editingId = id;
                $scope.cliente.load(id, function(data) {
                    $scope.newcliente = data;
                    $scope.showAdd('update');
                });
            };

            $scope.listAll = function(value) {

                $scope.searchAll = value;
                $scope.getList('recalculatePages');

            };

            $scope.delete = function(id) {
                $scope.cliente.delete(id, function(data, status) {
                    if (status === 200) {
                        showStatus('Empresa excluída com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.save = function() {
                $scope.newcliente.customer = $rootScope.getCustomer();
                $scope.cliente.save($scope.newcliente, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Clientee adicionado com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.update = function() {
                $scope.cliente.update($scope.newcliente, function(data, status) {
                    if (status === 200) {
                        $scope.hideAdd();
                        showStatus('Empresa atualizada com sucesso', 'success', 5000);
                        $scope.getList('recalculatePages');
                    } else {
                        showStatus('Erro: ' + data.message, 'error', 5000);
                    }
                });
            };

            $scope.saveCliente = function() {
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
                $scope.templateURL = 'views/cliente/cliente_add.html';
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
                    $scope.newcliente = {};
                }, 200);
            };

            $scope.editCliente = function(id) {
                $scope.editingId = id;
                $scope.cliente.load(id, function(data) {
                    $scope.newcliente = data;
                    $scope.showAdd('update');
                });
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

            $scope.hasLogo = function(cliente) {
                if (cliente.logo === null || !cliente.logo) {
                    cliente.logo = 'images/company-placeholder.png';
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
                var pagesize = $scope.cliente.totalPages;
                $scope.pageslength = new Array(pagesize);
                for (var c = 0; c < $scope.pageslength.length; c += 1) {
                    $scope.pageslength[c] = c + 1;
                }
                recalculatePageCounter();
            }

            function recalculatePageCounter() {
                var totalofpage = $scope.size * ($scope.page + 1);
                var paginationmin = 1 + ($scope.size * $scope.page);
                if (totalofpage > $scope.cliente.totalElements) {
                    totalofpage = $scope.cliente.totalElements;
                }
                $scope.totalElements = $scope.cliente.totalElements;
                $scope.pagesCounter = paginationmin + ' - ' + totalofpage;
                if ($scope.page + 1 > $scope.cliente.totalPages) {
                    $scope.changePage($scope.page);
                    return;
                }
            }

        }
    ];
});


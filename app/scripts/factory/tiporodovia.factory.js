define(['app'], function(app) {

    'use strict';

    app.factory('TipoRodovia', ['$http', '$rootScope', '$log', function($http, $rootScope, $log) {

        /**
         * @constructor
         */
        function Produto(data) {

            if (data) {
                this.setData(data);
            }
        }

        /**
         *
         * @type {{setData: Function, load: Function, update: Function, getHost: Function}}
         */
        Produto.prototype = {
            setData: function(data) {
                angular.extend(this, data);
            },
            list: function(page, size, sort, callback) {
                var self = this;
                $http.get($rootScope.getHost() + '/tiporodovias' + '?page=' + page + '&size=' + size + '&sort=' + sort)
                    .success(function(data, status, headers, config) {
                        self.setData(data);
                        $rootScope.$broadcast('Produto_LISTED');
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
                $http.get($rootScope.getHost() + '/tiporodovias/descricao/' + value + '/?page=' + page + '&size=' + size + '&sort=' + sort)
                    .success(function(data, status, headers, config) {
                        self.setData(data);
                        $rootScope.$broadcast('Produto_LISTED');
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
                $http.get($rootScope.getHost() + '/tiporodovias/' + id)
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
                $http.put($rootScope.getHost() + '/tiporodovias/' + model.id, model)
                    .success(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Produto_UPDATED');
                    })
                    .error(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Produto_UPDATED_ERROR');
                    });
            },
            save: function(model, callback) {
                $http.post($rootScope.getHost() + '/tiporodovias/', model)
                    .success(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Produto_SAVED');
                    })
                    .error(function(data, status, headers, config) {
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                        $rootScope.$broadcast('Produto_SAVED_ERROR');
                    });
            },
            delete: function(id, callback) {
                $http.delete($rootScope.getHost() + '/tiporodovias/' + id)
                    .success(function(data, status, headers, config) {
                        $rootScope.$broadcast('Produto_DELETED');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        $rootScope.$broadcast('Produto_DELETED_ERROR');
                        if (callback) {
                            callback(data, status, headers, config);
                        }
                    });
            }
        };

        return Produto;

    }]);
});

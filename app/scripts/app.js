define(['include'], function () {

    'use strict';

    var app = angular.module('sienge-web', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'ui.router',
        'ui.utils',
        'oc.lazyLoad',
        'pascalprecht.translate',
        'ui.bootstrap',
        'ngImgCrop'
    ]);

    app.CUSTOMER = {
        ID: 1
    };

    app.CONST = {
        LOCALHOST: 'http://localhost:8080',
        SERVER: 'http://ec2-54-175-225-0.compute-1.amazonaws.com:8080',

        // Security Server
        SECURITY_LOCALHOST: 'http://localhost:9999',
        SECURITY_SERVER: 'http://ec2-54-175-225-0.compute-1.amazonaws.com:9999',

        // OAuth2 Client ID / Secret
        OAUTH2_CLIENT_ID: 'client',
        OAUTH2_CLIENT_SECRET: 'secret'
    };

    angular.element = $;

    return app;
});

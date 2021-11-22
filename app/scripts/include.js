define(
  [
    'angularAMD', 'angular', 'jquery', 'bootstrap',
    'angular-ui-router', 'angular-ui-utils', 'angular-animate',
    'angular-bootstrap', 'angular-translate', 'angular-cookies', 'angular-messages', 'angular-touch',
    'angular-resource', 'angular-sanitize', 'popover', 'nemLogging', 'waypoints',
    'underscore', 'ngStorage', 'ocLazyLoad', 'angucomplete-alt','ngImgCrop',

    'directives/core.include.template.directive',
    'directives/core.main.directive',
    'directives/core.header.directive',
    'directives/core.footer.directive',
    'directives/core.on.finish.render.directive',
    'filters/core.trim.filter',
    'controllers/base.controller'
  ],
  function (angularAMD) {
    'use strict';

    return angularAMD;
  }
);

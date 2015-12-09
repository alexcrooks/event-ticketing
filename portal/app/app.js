App = {};

(function (App) {
  'use strict';

  App.app = angular.module('event-ticketing-portal', [
    'ngRoute',
    'ngResource',
    'ui.bootstrap.datetimepicker',
  ]);

  App.app.config(['$routeProvider', function ($routeProvider) {
    App.router.init($routeProvider);
  }]);

})(App);

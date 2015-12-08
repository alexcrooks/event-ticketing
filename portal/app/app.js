App = {};

(function (App) {
  'use strict';

  App.app = angular.module('event-ticketing-portal', [
    'ngRoute',
  ]);

  App.app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  }]);

})(App);

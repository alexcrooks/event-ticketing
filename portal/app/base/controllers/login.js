(function (App) {
  'use strict';

  /**
   * This file is a stub for an eventual proper auth mechanism.
   */

  function LoginCtrl($scope, $location, UserService) {
    function login() {
      UserService.login('foo', 'bar', function (err, user) {
        if (err) return;
        $location.path('/');
      });
    }

    $scope.form  = {};
    $scope.login = login;
  }

  App.app.controller('LoginCtrl', ['$scope', '$location', 'UserService', LoginCtrl]);

})(App);

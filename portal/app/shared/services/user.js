(function (App) {
  'use strict';

  /**
   * This file is a stub for an eventual proper auth mechanism.
   */

  function UserService() {
    var currentUser = null;

    function isLoggedIn() {
      return !!currentUser;
    }

    function currentUserId() {
      return currentUser && currentUser.id;
    }

    function login(emailAddress, password, callback) {
      currentUser = {
        id: 1,
        emailAddress: emailAddress,
        password: password,
      };
      callback(null, currentUser);
    }

    function logout(callback) {
      currentUser = null;
      callback();
    }

    return {
      isLoggedIn:     isLoggedIn,
      currentUserId:  currentUserId,
      login:          login,
      logout:         logout,
    };
  }

  App.app.factory('UserService', [UserService]);

})(App);

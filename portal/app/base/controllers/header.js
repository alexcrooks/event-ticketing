(function () {
  'use strict';

  /**
   * A static array of possible nav links.
   *
   * A nav link may have the following two properties:
   *
   * 1. `path`, the path to direct to when clicking the link
   * 2. `label`, the label to display to the user
   *
   * @type {object[]}
   */
  var navLinks = [
    {
      path: '/',
      label: 'Events',
      auth: _.constant(true),
    },
    {
      path: '/event',
      label: 'Create Event',
      auth: function (UserService) {
        return UserService.isLoggedIn();
      },
    },
    {
      path: '/login',
      label: 'Login',
      auth: function (UserService) {
        return !UserService.isLoggedIn();
      },
    },
  ];

  function HeaderCtrl($scope, $location, UserService) {
    /**
     * Get all valid links to display in the nav bar.
     *
     * @returns {object[]}
     */
    function getNavLinks() {
      return _.filter(navLinks, canViewNavLink);
    }

    /**
     * Can the user view this nav link right now?
     *
     * @param {object} navLink
     * @returns {boolean}
     */
    function canViewNavLink(navLink) {
      return navLink.auth(UserService);
    }

    /**
     * Does the user's current path match this nav link's path?
     *
     * @param {object} navLink An object returned by getNavLinks()
     * @returns {boolean} Whether or not the user is on the path
     */
    function isOnNavLink(navLink) {
      return $location.path() === navLink.path;
    }

    $scope.getNavLinks = getNavLinks;
    $scope.isOnNavLink = isOnNavLink;
  }

  App.app.controller('HeaderCtrl', ['$scope', '$location', 'UserService', HeaderCtrl]);

})(App);

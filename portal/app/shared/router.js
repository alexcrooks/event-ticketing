(function () {
  'use strict';

  /**
   * A small abstraction on top of the $routeProvider
   */

  var routes = [
    {
      route:      '/',
      template:   'event/views/list.html',
      controller: 'EventListCtrl',
    },
  ];

  /**
   * Add all of our routes and fall back to the home page if none match.
   *
   * @param $routeProvider
   */
  function init($routeProvider) {
    _.each(routes, addRoute.bind(this, $routeProvider));
    $routeProvider.otherwise({redirectTo: '/'});
  }

  /**
   * Add a new route.
   *
   * @param {$routeProvider} $routeProvider
   * @param {object} route
   */
  function addRoute($routeProvider, route) {
    $routeProvider.when(route.route, {
      templateUrl: route.template,
      controller:  route.controller,
    });
  }

  App.router = {
    init: init,
    addRoute: addRoute,
  };

})();

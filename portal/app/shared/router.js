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
    {
      route:      '/login',
      template:   'base/views/login.html',
      controller: 'LoginCtrl',
    },
    {
      route:      '/logout',
      template:   'base/views/login.html',
      controller: 'LoginCtrl',
    },
    {
      route:      '/events',
      template:   'event/views/list.html',
      controller: 'EventListCtrl',
    },
    {
      route:      '/event/:id',
      template:   'event/views/single.html',
      controller: 'EventSingleCtrl',
    },
    {
      route:      '/event',
      template:   'event/views/manage.html',
      controller: 'EventManageCtrl',
    },
    {
      route:      '/event/:id/manage',
      template:   'event/views/manage.html',
      controller: 'EventManageCtrl',
    },
    {
      route:      '/event/:id/tickets-purchased',
      template:   'event/views/tickets-purchased.html',
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

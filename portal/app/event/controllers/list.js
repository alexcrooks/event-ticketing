(function (App) {

  function EventListCtrl($scope, EventService) {
    var events = [];

    /**
     * Get all loaded non-cancelled events.
     *
     * @returns {EventModel[]}
     */
    function getEvents() {
      return _.filter(events, function (event) {
        return !event.isCancelled();
      });
    }

    /**
     * Load all events
     *
     * TODO: Pagination, search/filtering
     */
    EventService.list(null, function (err, results) {
      events = results;
    });

    $scope.getEvents = getEvents;
  }

  App.app.controller('EventListCtrl', ['$scope', 'EventService', EventListCtrl]);

})(App);

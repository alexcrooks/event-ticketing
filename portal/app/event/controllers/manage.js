(function (App) {

  function EventManageCtrl($scope, $routeParams, EventService) {
    var eventId = $routeParams.id;
    var event;
    var eventForm = null;
    var loaded = false;

    function isLoaded() {
      return loaded;
    }

    function setEventForm(form) {
      eventForm = form;
      form.init({event: event});
      form.open();
    }

    function loadEvent(eventId, callback) {
      if (eventId) {
        return EventService.get(eventId, callback);
      }
      return callback();
    }

    function isCreatingNewEvent() {
      return !eventId;
    }

    function getEventTitle() {
      return event ? event.title() : '';
    }

    loadEvent(eventId, function (err, result) {
      event = result;
      loaded = true;
    });

    $scope.isLoaded = isLoaded;
    $scope.isCreatingNewEvent = isCreatingNewEvent;
    $scope.getEventTitle = getEventTitle;
    $scope.setEventForm = setEventForm;
  }

  App.app.controller('EventManageCtrl', ['$scope', '$routeParams', 'EventService', EventManageCtrl]);

})(App);

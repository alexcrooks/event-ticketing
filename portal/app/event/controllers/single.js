(function (App) {

  function EventSingleCtrl($scope, $routeParams, $location, UserService, EventService) {
    var loaded = false;
    var ticketPurchaseForm;
    var event;

    /**
     * Can the current user manage this event?
     *
     * Rules:
     *
     * - Must be a logged in user
     * - Must be the user who created the event
     *
     * TODO: Proper permissions checks against the user.
     *
     * @param {EventModel} event
     * @returns {boolean}
     */
    function canManageEvent(event) {
      return UserService.isLoggedIn() && UserService.currentUserId() === event.creatorId();
    }

    /**
     * Cancel this event.
     *
     * @param {EventModel} event
     */
    function cancelEvent(event) {
      EventService.remove(event.id(), function (err) {
        if (err) {
          return; // TODO: Handle this case
        }
        $location.path('/');
      });
    }

    /**
     * @returns {boolean}
     */
    function isLoaded() {
      return loaded;
    }

    /**
     * Get the loaded event.
     *
     * @returns {EventModel}
     */
    function getEvent() {
      return event;
    }

    /**
     * @returns {boolean}
     */
    function isTicketPurchaseFormOpen() {
      return ticketPurchaseForm && ticketPurchaseForm.isOpen();
    }

    /**
     * Open the form to purchase a ticket.
     */
    function openTicketPurchaseForm() {
      ticketPurchaseForm && ticketPurchaseForm.open();
    }

    /**
     * @param {EventTicketPurchaseFormCtrl}
     */
    function setTicketPurchaseForm(form) {
      ticketPurchaseForm = form;
      form.init({event: event});
    }

    /**
     * Load an event by id.
     */
    EventService.get($routeParams.id, function (err, result) {
      event = result;
      loaded = true;
    });

    $scope.canManageEvent           = canManageEvent;
    $scope.cancelEvent              = cancelEvent;
    $scope.isLoaded                 = isLoaded;
    $scope.getEvent                 = getEvent;
    $scope.isTicketPurchaseFormOpen = isTicketPurchaseFormOpen;
    $scope.openTicketPurchaseForm   = openTicketPurchaseForm;
    $scope.setTicketPurchaseForm    = setTicketPurchaseForm;
  }

  App.app.controller('EventSingleCtrl', ['$scope', '$routeParams', '$location', 'UserService', 'EventService', EventSingleCtrl]);
  
})(App);

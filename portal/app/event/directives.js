(function () {
  'use strict';

  App.app.directive('eventList', function () {
    return {
      restrict:    'A',
      replace:     true,
      controller:  'EventListCtrl',
      templateUrl: 'event/views/list.html',
    };
  });

  App.app.directive('eventTile', function () {
    return {
      restrict:    'A',
      replace:     true,
      templateUrl: 'event/views/tile.html',
    };
  });

  App.app.directive('eventForm', function () {
    return {
      restrict:    'A',
      replace:     true,
      controller:  'EventFormCtrl',
      templateUrl: 'event/views/form.html',
    };
  });

  App.app.directive('eventTicketPurchaseForm', function () {
    return {
      restrict:    'A',
      replace:     true,
      controller:  'EventTicketPurchaseFormCtrl',
      templateUrl: 'event/views/ticket-purchase-form.html',
    };
  });

  App.app.directive('eventTicketsPurchased', function () {
    return {
      restrict:    'A',
      replace:     true,
      templateUrl: 'event/views/tickets-purchased.html',
    };
  });

})();

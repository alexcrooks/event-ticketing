(function (App) {

  function EventTicketPurchaseFormCtrl($controller, $scope, $location, EventService) {
    $controller('BaseForm', {$scope: $scope, options: {
      methods: {
        buildFormData: buildFormData,
        buildEntity:   buildEntity,
        save:          save,
      },
      hooks: {
        onSave: onSave,
      },
      helpers: {
        calculateTicketTypeTotal: calculateTicketTypeTotal,
        calculateGrandTotal:      calculateGrandTotal,
      },
    }});
    var form = $scope.form;

    function getEventId(event) {
      if (!event) {
        event = form.state.event;
      }
      return event && event.id();
    }

    function onSave() {
      $location.path('/event/' + getEventId() + '/tickets-purchased');
    }

    function buildFormData(state) {
      var ticketTypes = state.event ? state.event.ticketTypes() : [];
      return {
        ticketTypes: buildTicketTypesForForm(ticketTypes),
      };
    }

    function buildTicketTypesForForm(ticketTypes) {
      return _.chain(ticketTypes)
        .filter(ticketTypeCanBePurchased)
        .map(buildTicketTypeForForm)
        .value();
    }

    function ticketTypeCanBePurchased(ticketType) {
      return ticketType.quantityRemaining() > 0;
    }

    function buildTicketTypeForForm(ticketType) {
      return {
        id:                ticketType.id(),
        cost:              ticketType.cost(),
        description:       ticketType.description(),
        quantityRemaining: ticketType.quantityRemaining(),
      };
    }

    function buildEntity(formData) {
      return {
        ticketTypes: buildTicketTypesFromForm(formData.ticketTypes),
      };
    }

    function buildTicketTypesFromForm(data) {
      return _.chain(data)
        .filter(isPurchasingTicketType)
        .map(buildTicketTypeFromForm)
        .value();
    }

    function isPurchasingTicketType(data) {
      return _.isNumber(data.quantity) && data.quantity > 0;
    }

    function buildTicketTypeFromForm(data) {
      return {
        id:       data.id,
        quantity: data.quantity,
      };
    }

    function save(data, callback) {
      EventService.purchaseTickets(getEventId(), data, callback);
    }

    function calculateTicketTypeTotal(ticketType) {
      return parseFloat(ticketType.cost * ticketType.quantity, 10) || 0;
    }

    function calculateGrandTotal(ticketTypes) {
      return _.reduce(ticketTypes, function (memo, ticketType) {
          return calculateTicketTypeTotal(ticketType) + memo;
        }, 0) || 0;
    }
  }

  App.app.controller('EventTicketPurchaseFormCtrl', ['$controller', '$scope', '$location', 'EventService', EventTicketPurchaseFormCtrl]);

})(App);

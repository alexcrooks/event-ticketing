(function (App) {

  function EventFormCtrl($controller, $scope, $location, EventService) {
    $controller('BaseForm', {$scope: $scope, options: {
      methods: {
        buildFormData: buildFormData,
        buildEntity:   buildEntity,
        save:          save,
      },
      hooks: {
        onSave:  goToEvent,
        onClose: onClose,
      },
      helpers: {
        addTicketType:    addTicketType,
        removeTicketType: removeTicketType,
      },
    }});
    var form = $scope.form;

    function getEventId(event) {
      if (!event) {
        event = form.state.event;
      }
      return event && event.id();
    }

    function goToEvent(event) {
      $location.path('event/' + getEventId(event));
    }

    function onClose() {
      if (getEventId()) {
        return goToEvent();
      }
      $location.path('');
    }

    function buildFormData(state) {
      return state.event ? state.event.buildForForm() : getBareFormData();
    }

    function getBareFormData() {
      return {
        ticketTypes: [{}],
      };
    }

    function buildEntity(formData) {
      return {
        id:          getEventId(),
        title:       formData.title,
        description: formData.description,
        location:    formData.location,
        doorsAt:     getDate(formData.doorsAt),
        startsAt:    getDate(formData.startsAt),
        endsAt:      getDate(formData.endsAt),
        ticketTypes: getTicketTypes(formData.ticketTypes),
      };
    }

    function getTicketTypes(ticketTypes) {
      return _.map(ticketTypes, transformTicketType);
    }

    function transformTicketType(ticketType) {
      return {
        id:          ticketType.id,
        description: ticketType.description,
        cost:        ticketType.cost,
        quantity:    ticketType.quantity,
      };
    }

    function getDate(date) {
      if (date instanceof Date) {
        return moment(date).format();
      }
    }

    function save(data, callback) {
      EventService.save(data, callback);
    }

    function addTicketType(ticketTypes) {
      ticketTypes.push({});
    }

    function removeTicketType(formData, index) {
      formData.ticketTypes = _.without(formData.ticketTypes, formData.ticketTypes[index]);
    }

    $scope.form = form;
  }

  App.app.controller('EventFormCtrl', ['$controller', '$scope', '$location', 'EventService', EventFormCtrl]);

})(App);

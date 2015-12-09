(function () {
  'use strict';

  var url = App.config.apiEndpoint + 'events/:id';
  var actions = {
    purchaseTickets: {method: 'POST', url: url + '/purchaseTickets'},
  };
  var methods = {
    purchaseTickets: purchaseTickets,
  };

  /**
   * Purchase tickets for a resource.
   *
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {number} id
   * @param {data} data
   * @param {function} callback
   */
  function purchaseTickets(resource, model, id, data, callback) {
    resource.purchaseTickets({id: id}, data, function () {
      callback();
    });
  }

  App.app.factory('EventService', ['$resource', function ($resource) {
    return App.serviceBuilder.build($resource, EventModel, url, null, actions, null, methods);
  }]);

})();

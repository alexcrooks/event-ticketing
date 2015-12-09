(function () {
  'use strict';

  var url = App.config.apiEndpoint + 'events/:id';

  App.app.factory('EventService', ['$resource', function ($resource) {
    return App.serviceBuilder.build($resource, EventModel, url);
  }]);

})();

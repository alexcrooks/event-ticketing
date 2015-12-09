(function () {
  'use strict';

  /**
   * Service Builder
   * 
   * This is an abstract library that consumes some configuration and outputs a
   * RESTful resource, which can be extended with custom methods.
   * 
   * See the signature for serviceBuilder.build() for details.
   */

  /**
   * Our default methods to provide. These are the base methods for a CRUD
   * oriented REST endpoint.
   * 
   * Spec for these objects is defined in:
   * https://docs.angularjs.org/api/ngResource/service/$resource
   */
  var baseActions = {
    'get':    {method: 'GET'},
    'list':   {method: 'GET', isArray: true},
    'remove': {method: 'DELETE'},
    'delete': {method: 'DELETE'},
    'create': {method: 'POST'},
    'update': {method: 'PUT'},
  };

  /**
   * Default methods to export for use.
   * 
   * These methods are defined within this file and provide an abstraction on
   * top of Angular's native $resource methods to automatically handle some
   * typical response cases and instantiate return values into our models.
   */
  var baseMethods = {
    'save':   save,
    'create': create,
    'update': update,
    'remove': remove,
    'get':    getOne,
    'list':   getMany,
  };

  /**
   * Return an object of functions with the resource and model bound to the args.
   * 
   * This begins by combining our "base" set of methods and the custom methods
   * defined at build time. It then binds (resource, model) to each method, and
   * returns the result.
   * 
   * What this means, is that _every_ function in the baseMethods or methods
   * objects should expect the first two arguments to be `resource` and `model`
   * respectively.
   * 
   * e.g.,
   * 
   * methods = {
   *   foo: function (resource, model, bar, baz) {
   *   
   *   }
   * }
   * 
   * Where resource and model are bound automatically, so at call time you may
   * call Service.foo('arg-for-bar', 'arg-for-baz');
   * 
   * @param {$resource} resource
   * @param {*Model} model e.g., EventModel
   * @param {object} [methods] Optional object of extra functions
   * @returns {object} bound functions to expose in this service's API
   */
  function getMethods(resource, model, methods) {
    return _.chain(baseMethods)
      .extend(methods)
      .mapObject(function (method) {
        return _.partial(method, resource, model);
      })
      .value();
  }

  /**
   * Get the union of the base CRUDish RESTful actions and any custom extras.
   * 
   * The `actions` param should be an object of objects following the form in:
   * https://docs.angularjs.org/api/ngResource/service/$resource
   * 
   * @param {object} [actions]
   */
  function getActions(actions) {
    return _.extend(baseActions, actions);
  }

  /**
   * Create or update an object in a resource.
   * 
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {object} data
   * @param {function} callback
   */
  function save(resource, model, data, callback) {
    var method = data.id ? update : create;
    method.apply(this, arguments);
  }

  /**
   * Create a resource.
   *
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {object} data
   * @param {function} callback
   */
  function create(resource, model, data, callback) {
    resource.create(data, function (result) {
      callback(null, transformResult(model, result));
    });
  }

  /**
   * Update a resource by ID.
   *
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {object} object
   * @param {function} callback
   */
  function update(resource, model, object, callback) {
    var data = _.omit(object, 'id');
    resource.update({id: object.id}, data, function (result) {
      callback(null, transformResult(model, result));
    });
  }
  
  /**
   * Remove a resource by ID.
   *
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {number} id
   * @param {function} callback
   */
  function remove(resource, model, id, callback) {
    resource.remove({id: id}, function () {
      callback();
    });
  }

  /**
   * Get a resource by ID.
   *
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {number} id
   * @param {function} callback
   */
  function getOne(resource, model, id, callback) {
    resource.get({id: id}, function (result) {
      callback(null, transformResult(model, result));
    });
  }

  /**
   * Get many of a resource based on search.
   * 
   * TODO: Support filtering and pagination.
   * 
   * @param {$resource} resource Automatically bound
   * @param {*Model} model Automatically bound
   * @param {object} [criteria] A filter criteria for the server
   * @param {function} callback
   */
  function getMany(resource, model, criteria, callback) {
    criteria = criteria || {};
    resource.list(criteria, function (results) {
      callback(null, transformResults(model, results));
    });
  }

  /**
   * Instantiate an array of objects with a model.
   *
   * @param {*Model} model
   * @param {object[]} results
   * @returns {*Model[]}
   */
  function transformResults(model, results) {
    return _.map(results, transformResult.bind(this, model));
  }

  /**
   * Instantiate an object with a model.
   *
   * @param {*Model} model
   * @param {object} result
   * @returns {*Model}
   */
  function transformResult(model, result) {
    return new model(result);
  }

  /**
   * Build a service.
   *
   * Given a resource, model, endpoint and optionally , return a bound API
   * to return as a service.
   *
   * `$resource` should always just be an untouched $resource instance as
   * injected into a service by Angular
   *
   * `model` is a required parameter corresponding to a model for the particular
   * entity, e.g., if the entity is an event, then this would be the uncalled
   * `EventModel` constructor
   *
   * See https://docs.angularjs.org/api/ngResource/service/$resource for
   * specification on the expected arguments format for optional parameters
   * `url`, `paramDefaults`, `actions`, `options`
   *
   * `methods` is an optional parameter which should be defined with extra
   * method for the service to expose. A common use case for this, for example,
   * would be if a custom action is provided in `actions`. A custom method
   * should be created to be able to access this particular action.
   *
   * See the `EventService` for a sample usage of this library.
   *
   * @param {$resource} $resource
   * @param {*Model} model
   * @param {string} url String matching $resource spec for url
   * @param {object} [paramDefaults] Object matching $resource spec for paramDefaults
   * @param {object} [actions] Object matching $resource spec for actions
   * @param {object} [options] Object matching $resource spec for options
   * @param {object} [methods] Custom methods to expose in the API
   * @returns {object} A set of methods for communicating with this resource RESTfully
   */
  function build($resource, model, url, paramDefaults, actions, options, methods) {
    actions = getActions(actions);
    var resource = $resource(url, paramDefaults, actions, options);
    return getMethods(resource, model, methods);
  }

  App.serviceBuilder = {
    build: build,
  };

})();

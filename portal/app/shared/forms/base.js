(function () {
  'use strict';

  function getMethods(methods) {
    if (!_.isObject(methods)) {
      throw new Error('Must provide a methods object as part of the form options');
    }
    if (!_.isFunction(methods.buildFormData)) {
      throw new Error('Must provide a buildFormData method as part of the form methods');
    }
    if (!_.isFunction(methods.buildEntity)) {
      throw new Error('Must provide a buildEntity method as part of the form methods');
    }
    if (!_.isFunction(methods.save)) {
      throw new Error('Must provide a save method as part of the form methods');
    }
    return methods;
  }

  function getHooks(hooks) {
    hooks = hooks || {};
    return _.defaults(hooks, {
      onSave:  _.noop,
      onClose: _.noop,
    });
  }

  function getHelpers(helpers) {
    return helpers || {};
  }

  function BaseForm($scope, options) {
    var opened  = false;
    var methods = getMethods(options.methods);
    var hooks   = getHooks(options.hooks);
    var helpers = getHelpers(options.helpers);
    var form    = _.extend(helpers, {
      state:  {},
      data:   {},
      init:   init,
      open:   open,
      isOpen: isOpen,
      close:  close,
      save:   save,
    });

    function init(state) {
      form.state = state;
    }

    function open() {
      opened = true;
      form.data = methods.buildFormData(form.state);
    }

    function isOpen() {
      return opened;
    }

    function close() {
      opened = false;
      hooks.onClose();
    }

    function save() {
      var data = methods.buildEntity(form.data);
      methods.save(data, function (err, result) {
        if (err) {
          return; // TODO: display errors or place validation errors on page
        }
        hooks.onSave(result);
      });
    }

    $scope.form = form;
  }

  App.app.controller('BaseForm', ['$scope', 'options', BaseForm]);
})();

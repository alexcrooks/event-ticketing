(function () {
  'use strict';

  App.app.directive('header', function headerDirective() {
    return {
      restrict:    'A',
      replace:     true,
      controller:  'HeaderCtrl',
      templateUrl: 'base/views/header.html',
    };
  });

})();

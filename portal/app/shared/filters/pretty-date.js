(function () {
  'use strict';

  App.app.filter('prettyDate', function () {
    return function (date) {
      if (!date) {
        return '';
      }
      return moment(date).format('LLLL');
    };
  });

})();

'use strict';

var _ = require('underscore');

/**
 * Remove falsy/undefined properties from an object.
 *
 * @param {object} o
 * @returns {object}
 * @author http://stackoverflow.com/a/14058408/2403916
 */
module.exports = function (o) {
  var clone = _.clone(o);
  _.each(clone, function(v, k) {
    if(!v) {
      delete clone[k];
    }
  });
  return clone;
};

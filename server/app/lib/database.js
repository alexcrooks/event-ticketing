'use strict';

var orm = require('orm');

function defineModels(db, models, next) {
  db.sync(next);
}

module.exports = function (databaseSettings) {
  return orm.express(databaseSettings, {define: defineModels});
};

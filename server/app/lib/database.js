'use strict';

var orm = require('orm');

/**
 * Build out the models and associations based
 *
 * The db.sync() call updates the database schema to the configured schema as
 * defined in the models and their associations.
 *
 * TODO: The sync() call should be removed and the relevant logic should be
 * ported to a migration script (requires adding a migration runner).
 *
 * TODO: With a bit of abstraction these server-side models could be placed into
 * a node/bower package and be used cohesively on the front- and back-end.
 *
 * @param db
 * @param models
 * @param next
 */
function defineModels(db, models, next) {
  models.event = require('../models/event')(db);
  models.ticketType = require('../models/ticket-type')(db);
  models.event.hasMany('ticketTypes', models.ticketType, {}, {
    mergeTable:   'event_ticket_types',
    mergeAssocId: 'ticket_type_id',
    autoFetch:    true,
  });
  db.sync(next);
}

module.exports = function (databaseSettings) {
  return orm.express(databaseSettings, {define: defineModels});
};

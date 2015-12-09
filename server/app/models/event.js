'use strict';

/**
 * An event is, e.g., a concert, sports game.
 *
 * An event can have several ticket types, as defined in the ticketType model.
 *
 * The join table between this and the ticket types table is managed in the
 * database model builder calling event.hasMany('ticket_types').
 */
var schema = {
  id:          {type: 'serial'},
  /**
   * TODO (stub for future implementation)
   */
  creatorId:   {type: 'integer', required: true, mapsTo: 'creator_id'},
  title:       {type: 'text', required: true},
  description: {type: 'text', defaultValue: ''},
  location:    {type: 'text', defaultValue: ''},
  createdAt:   {type: 'date', time: true, mapsTo: 'created_at'},
  modifiedAt:  {type: 'date', time: true, mapsTo: 'modified_at'},
  cancelledAt: {type: 'date', time: true, mapsTo: 'cancelled_at'},
  doorsAt:     {type: 'date', time: true, required: true, mapsTo: 'doors_at'},
  startsAt:    {type: 'date', time: true, required: true, mapsTo: 'starts_at'},
  endsAt:      {type: 'date', time: true, required: true, mapsTo: 'ends_at'},
};

var hooks = {
  beforeCreate: function (next) {
    this.createdAt = new Date();
    next();
  },

  beforeModify: function (next) {
    this.modifiedAt = new Date();
    next();
  },
};

module.exports = function (db) {
  return db.define('event', schema, {hooks: hooks});
};

'use strict';

/**
 * A ticket type is a "block" of a certain type of tickets for an event.
 *
 * e.g., a concert might have 100 VIP tickets @ $50 each and 1000 Basic tickets
 * at $30 each. These are each ticket types.
 *
 * The join table between this and the event table is created by the event model
 * calling hasMany('ticket_types').
 */
var schema = {
  id:                {type: 'serial'},
  description:       {type: 'text', defaultValue: '', required: true},
  cost:              {type: 'number', defaultValue: 0, required: true},
  quantity:          {type: 'integer', defaultValue: 0, required: true},
  quantityPurchased: {type: 'integer', defaultValue: 0, mapsTo: 'quantity_purchased'},
  createdAt:         {type: 'date', time: true, mapsTo: 'created_at'},
  modifiedAt:        {type: 'date', time: true, mapsTo: 'modified_at'},
  deletedAt:         {type: 'date', time: true, mapsTo: 'deleted_at'},
};

var hooks = {
  beforeCreate: function (next) {
    this.createdAt = new Date();
    next();
  },

  beforeModify: function (next) {
    this.modifiedAt = new Date();
    next();
  }
};

module.exports = function (db) {
  return db.define('ticket_type', schema, {hooks: hooks});
};

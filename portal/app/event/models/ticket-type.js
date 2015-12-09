EventTicketTypes = {};

(function () {
  'use strict';

  EventTicketTypes = function EventTicketTypes(doc) {
    if (doc instanceof EventTicketTypes) {
      return doc;
    }
    this._doc = doc || {};
  };

  var getters = {
    /**
     * @returns {number}
     */
    id: function () {
      return this._doc.id || '';
    },

    /**
     * @returns {string}
     */
    description: function () {
      return this._doc.description || '';
    },

    /**
     * @returns {number}
     */
    cost: function () {
      return parseFloat(this._doc.cost, 10) || 0;
    },

    /**
     * @returns {number}
     */
    quantity: function () {
      return parseInt(this._doc.quantity, 10) || 0;
    },

    /**
     * @returns {number}
     */
    quantityPurchased: function () {
      return parseInt(this._doc.quantityPurchased, 10) || 0;
    },

    /**
     * @returns {number}
     */
    quantityRemaining: function () {
      return this.quantity() - this.quantityPurchased();
    },
  };

  EventTicketTypes.prototype = _.extend(
    EventTicketTypes.prototype,
    getters
  );

})();

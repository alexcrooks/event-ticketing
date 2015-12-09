EventModel = {};

(function () {
  'use strict';

  EventModel = function EventModel(doc) {
    if (doc instanceof EventModel) {
      return doc;
    }
    doc.ticketTypes = this.transformTicketTypes(doc.ticketTypes);
    this._doc = doc || {};
  };

  var getters = {
    /**
     * @returns {number}
     */
    id: function () {
      return this._doc.id;
    },

    /**
     * @returns {number}
     */
    creatorId: function () {
      return this._doc.creatorId;
    },

    /**
     * @returns {boolean}
     */
    isCancelled: function () {
      return !!this._doc.cancelledAt;
    },

    /**
     * @returns {string}
     */
    title: function () {
      return this._doc.title || '';
    },

    /**
     * @returns {string}
     */
    description: function () {
      return this._doc.description || '';
    },

    /**
     * @returns {string}
     */
    location: function () {
      return this._doc.location || '';
    },

    /**
     * @returns {object[]}
     */
    ticketTypes: function () {
      return this._doc.ticketTypes || [];
    },

    /**
     * @returns {Date}
     */
    doorsAt: function () {
      return _.isString(this._doc.doorsAt) ? moment(this._doc.doorsAt).toDate() : null;
    },

    /**
     * @returns {Date}
     */
    startsAt: function () {
      return _.isString(this._doc.startsAt) ? moment(this._doc.startsAt).toDate() : null;
    },

    /**
     * @returns {Date}
     */
    endsAt: function () {
      return _.isString(this._doc.endsAt) ? moment(this._doc.endsAt).toDate() : null;
    },
  };

  var mutators = {
    transformTicketTypes: function (ticketTypes) {
      ticketTypes = _.isArray(ticketTypes) ? ticketTypes : [];
      return _.map(ticketTypes, function (ticketType) {
        return new EventTicketTypes(ticketType);
      });
    },
  };

  var serializers = {
    buildForForm: function () {
      return {
        title:       this.title(),
        description: this.description(),
        location:    this.location(),
        doorsAt:     this.doorsAt(),
        startsAt:    this.startsAt(),
        endsAt:      this.endsAt(),
        ticketTypes: _.map(this.ticketTypes(), function (ticketType) {
          return ticketType.buildForForm();
        }),
      };
    },
  };

  EventModel.prototype = _.extend(
    EventModel.prototype,
    getters,
    mutators,
    serializers
  );

})();

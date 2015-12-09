var express = require('express');
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var compactObject = require('../lib/compact-object');
var router = express.Router();

/**
 * For requests with an `eventId` param, find and add the event to the request.
 *
 * Return 400 if the eventId is invalid. Return 404 if the event does not exist.
 */
router.param('eventId', function (req, res, next, id) {
  id = parseInt(id, 10);
  if (!_.isFinite(id)) {
    return res.sendStatus(400);
  }
  req.models.event.one({id: id}, function (err, event) {
    if (err) return next(err);
    if (!event) return res.sendStatus(404);
    req.event = event;
    return next();
  })
});

/**
 * Get all events.
 *
 * TODO: Add filtering capabilities
 *
 * TODO: Add pagination
 */
router.get('/events', function (req, res, next) {
  req.models.event.find({cancelledAt: null}, function (err, events) {
    if (err) return next(err);
    return res.json(events);
  });
});

/**
 * Get a single event by id.
 */
router.get('/events/:eventId', function (req, res, next) {
  res.json(req.event);
});

/**
 * Create an event.
 *
 * Expects an event object with a nested ticketTypes array.
 *
 * TODO: The flow here is identical to PUT /events/:id, match it up.
 *
 * TODO: Wrap in transaction so if any part fails we can fall back easily.
 */
router.post('/events', function (req, res, next) {
  var eventData = buildEvent(req.body, req.user);
  var ticketTypesData = buildTicketTypes(req.body.ticketTypes);
  var tasks = [
    createEvent.bind(this, req.models.event, eventData),
    syncTicketTypes.bind(this, req.models.ticketType, ticketTypesData),
  ];
  async.waterfall(tasks, function (err, event) {
    if (err) return next(err);
    return res.json(event);
  });
});

/**
 * Update an event.
 *
 * Expects an event object with a nested ticketTypes array.
 *
 * TODO: The flow here is identical to POST /events, match it up.
 *
 * TODO: Wrap in transaction so if any part fails we can fall back easily.
 */
router.put('/events/:eventId', function (req, res, next) {
  var eventData = buildEvent(req.body);
  var ticketTypesData = buildTicketTypes(req.body.ticketTypes);
  var tasks = [
    updateEvent.bind(this, req.event, eventData),
    syncTicketTypes.bind(this, req.models.ticketType, ticketTypesData),
  ];
  async.waterfall(tasks, function (err, event) {
    if (err) return next(err);
    return res.json(event);
  });
});

/**
 * Cancel an event.
 */
router.delete('/events/:eventId', function (req, res, next) {
  req.event.cancelledAt = new Date();
  req.event.save(function (err) {
    if (err) return next(err);
    return res.sendStatus(200);
  });
});

/**
 * Create a new event given an object.
 *
 * The object expected by EventModel.create should be flat, and any creates or
 * updates of associations should be handled separately.
 *
 * @param {EventModel} EventModel The
 * @param {object} data Event object from buildEvent()
 * @param {function} callback
 */
function createEvent(EventModel, data, callback) {
  EventModel.create(data, callback);
}

/**
 * Update an existing event given an object of changes.
 *
 * The object expected by EventModel.create should be flat, and any creates or
 * updates of associations should be handled separately.
 *
 * @param {EventInstance} event
 * @param {object} data Event object from buildEvent()
 * @param {function} callback
 */
function updateEvent(event, data, callback) {
  event = _.extend(event, data);
  event.save(callback);
}

/**
 * Given an array of objects representing ticket types, associate them with an event.
 *
 * This method will, for an event:
 *
 * 1. Create new ticket types in the database for `data` objects that do not exist
 * 2. Update ticket types for `data` objects that do exist
 * 3. Unassociate ticket types for `data` objects that exist in the database but
 *    not the `data` object
 * 4. Associate ticket types for any created types from the `data object`
 *
 * @param {TicketTypeModel} TicketTypeModel
 * @param {object[]} data An array of objects from buildTicketTypes()
 * @param {Event} event
 * @param {function} callback
 */
function syncTicketTypes(TicketTypeModel, data, event, callback) {
  async.map(data, syncTicketType.bind(this, TicketTypeModel), function (err, ticketTypes) {
    if (err) return callback(err);
    return setTicketTypes(event, ticketTypes, callback);
  });
}

/**
 * Given an array of ticket type ORM models, set them to the event.
 *
 * The event.setTicketTypes() method will automatically remove old and create
 * new associations from the provided array.
 *
 * @param {Event} event
 * @param {TicketType[]} ticketTypes
 * @param {function} callback
 */
function setTicketTypes(event, ticketTypes, callback) {
  event.setTicketTypes(ticketTypes, function (err, ticketTypes) {
    if (err) return callback(err);
    event.ticketTypes = ticketTypes;
    return callback(null, event);
  });
}

/**
 * Create a new or update the existing ticket type.
 *
 * If an ID is provided in the data object, then this will update, otherwise
 * a create occurs.
 *
 * @param {TicketTypeModel} TicketTypeModel
 * @param {object} data
 * @param callback
 */
function syncTicketType(TicketTypeModel, data, callback) {
  var method = !!data.id ? findAndUpdateTicketType : createTicketType;
  method(TicketTypeModel, data, callback);
}

/**
 * Create a new ticket type given an object.
 *
 * @param {TicketTypeModel} TicketTypeModel
 * @param {object} data
 * @param {function} callback
 */
function createTicketType(TicketTypeModel, data, callback) {
  TicketTypeModel.create(data, callback);
}

/**
 *
 * Get a ticket type based on the provided ID and update it with the provided changes.
 *
 * @param {TicketTypeModel} TicketTypeModel
 * @param {object} data Ticket type object from buildTicketType()
 * @param {function} callback
 */
function findAndUpdateTicketType(TicketTypeModel, data, callback) {
  TicketTypeModel.one({id: data.id}, function (err, ticketType) {
    if (err) return callback(err);
    ticketType = _.extend(ticketType, data);
    ticketType.save(callback);
  });
}

/**
 * Build a simple create/change summary for an event.
 *
 * The compactObject call is used to completely delete properties that are
 * undefined, as otherwise, passing an object with, e.g. {foo: undefined}, to
 * Model.save will try to unset the property.
 *
 * @param {object} data The event object from the request body
 * @param {object} [user] Only needs to be provided on create to track the creator
 * @returns {object} A simple object representing changes for Event.save
 */
function buildEvent(data, user) {
  return compactObject({
    creatorId:   user && user.id,
    title:       data.title,
    description: data.description,
    location:    data.location,
    doorsAt:     moment(data.doorsAt).toDate(),
    startsAt:    moment(data.startsAt).toDate(),
    endsAt:      moment(data.endsAt).toDate(),
  });
}

/**
 * Build a simple create/change summary for an array of ticket types.
 *
 * @param {object[]} data An array of ticket types from the request body
 * @returns {object} A simple object representing changes for TicketType.save
 */
function buildTicketTypes(data) {
  return _.map(data, buildTicketType);
}

/**
 * Build a simple create/change summary for a ticket type.
 *
 * The compactObject call is used to completely delete properties that are
 * undefined, as otherwise, passing an object with, e.g. {foo: undefined}, to
 * Model.save will try to unset the property.
 *
 * @param {object} data A single ticket type from the request body
 * @returns {object}
 */
function buildTicketType(data) {
  return compactObject({
    id:          data.id,
    description: data.description,
    cost:        data.cost,
    quantity:    data.quantity,
  });
}

module.exports = router;

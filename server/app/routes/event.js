var express = require('express');
var _ = require('underscore');
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

module.exports = router;

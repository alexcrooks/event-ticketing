'use strict';

var expect = require('expect.js');

describe('Event routes', function () {

  describe('GET /events', function () {

    it('should return an array of events');

  });

  describe('GET /event/:id', function () {

    it('should return HTTP 400 if the id is not an integer');

    it('should return HTTP 404 if the event does not exist');

    it('should return an event with nested ticket types');

  });

  describe('POST /events', function () {

    it('should return HTTP 400 if no ticket types were provided');

    it('should return HTTP 400 if the event is missing required fields');

    it('should return HTTP 400 if the event provides invalid dates');

    it('should return HTTP 400 if any ticket type is missing required fields');

    it('should return HTTP 400 if any ticket type has a negative quantity');

    it('should not allow setting of protected event fields');

    it('should not allow setting of protected ticket type fields');

    it('should return validation failures as easily-understandable JSON');

    it('should create a new event and its ticket types');

  });

  describe('PUT /events/:id', function () {

    it('should return error 400 if the id is not an integer');

    it('should return error 404 if the event does not exist');

    it('should return HTTP 400 if no ticket types were provided');

    it('should return HTTP 400 if the event is missing required fields');

    it('should return HTTP 400 if the event provides invalid dates');

    it('should return HTTP 400 if any ticket type is missing required fields');

    it('should return HTTP 400 if any ticket type has a negative quantity');

    it('should return HTTP 400 if a ticket type with sold tickets is removed');

    it('should not allow setting of protected event fields');

    it('should not allow changing of protected event fields');

    it('should not allow setting of protected ticket type fields');

    it('should not allow changing of protected ticket type fields');

    it('should return validation failures as easily-understandable JSON');

    it('should update an event and its ticket types');

    it('should remove ticket types from the event that were not present in the body');

    it('should add new ticket types to the event if they did not exist');

    it('should update existing ticket types in the event');

    it('should fall back gracefully if an intermediate step fails');

  });

  describe('DELETE /events/:id', function () {

    it('should return HTTP 400 if the id is not an integer');

    it('should return HTTP 404 if the event does not exist');

    it('should return HTTP 400 if the event has had tickets purchased');

    it('should set the cancelledAt property on the event');

  });

  describe('POST /events/:id/purchaseTickets', function () {

    it('should return HTTP 400 if the tickets for any ticket type are sold out');

    it('should update the quantityPurchased property of each ticket type');

    it('should fall back gracefully if only some ticket types hit validation issues');

  });

});

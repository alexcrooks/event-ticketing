describe('EventModel', function () {
  var baseEvent, event;

  beforeEach(function () {
    baseEvent = {
      id: 11,
      creatorId: 22,
      title: 'ODESZA',
      description: 'Opener: Ekali',
      location: 'Commodore Ballroom',
      cancelledAt: '2015-12-01T14:00:00.000Z',
      doorsAt: '2015-12-02T21:00:00.000Z',
      startsAt: '2015-12-02T22:00:00.000Z',
      endsAt: '2015-12-03T02:00:00.000Z',
      ticketTypes: [
        {
          id: 33,
          description: 'VIP General Admission',
          cost: 100,
          quantity: 100,
          quantityPurchased: 0,
        },
        {
          id: 44,
          description: 'General Admission',
          cost: 50,
          quantity: 1000,
          quantityPurchased: 0,
        }
      ]
    };
    event = new EventModel(baseEvent);
  });

  describe('function id()', function () {

    it('should return the id', function () {
      expect(event.id()).toEqual(11);
    });

  });

  describe('function creatorId()', function () {

    it('should return the creator id', function () {
      expect(event.creatorId()).toEqual(22);
    });

  });

  describe('function isCancelled()', function () {

    it('should return true if the event has a cancelled date', function () {
      expect(event.isCancelled()).toBe(true);
    });

    it('should return false if the event does not have a cancelled date', function () {
      delete event._doc.cancelledAt;
      expect(event.isCancelled()).toBe(false);
    });

  });

  describe('function title()', function () {
    
    it('should return the title', function () {
      expect(event.title()).toEqual(baseEvent.title);
    });
    
    it('should default to an empty string', function () {
      delete event._doc.title;
      expect(event.title()).toEqual('');
    });

  });

  describe('function description()', function () {

    it('should return the description', function () {
      expect(event.description()).toEqual(baseEvent.description);
    });

    it('should default to an empty string', function () {
      delete event._doc.description;
      expect(event.description()).toEqual('');
    });

  });

  describe('function location()', function () {

    it('should return the location', function () {
      expect(event.location()).toEqual(baseEvent.location);
    });

    it('should default to an empty string', function () {
      delete event._doc.location;
      expect(event.location()).toEqual('');
    });

  });

  describe('function ticketTypes()', function () {
    
    it('should return an array of ticket types', function () {
      var ticketTypes = event.ticketTypes();
      expect(_.isArray(ticketTypes)).toBe(true);
      expect(_.first(ticketTypes) instanceof EventTicketTypes).toBe(true);
    });
    
    it('should return an empty array if no ticket types exist', function () {
      delete event._doc.ticketTypes;
    });

  });

  describe('function doorsAt()', function () {

    it('should return the date as a date object', function () {
      expect(event.doorsAt() instanceof Date).toBe(true);
    });

    it('should return null if the date is not a string', function () {
      delete event._doc.doorsAt;
      expect(event.doorsAt()).toBe(null);
    });

  });

  describe('function startsAt()', function () {

    it('should return the date as a date object', function () {
      expect(event.startsAt() instanceof Date).toBe(true);
    });

    it('should return null if the date is not a string', function () {
      delete event._doc.startsAt;
      expect(event.startsAt()).toBe(null);
    });

  });

  describe('function endsAt()', function () {

    it('should return the date as a date object', function () {
      expect(event.endsAt() instanceof Date).toBe(true);
    });

    it('should return null if the date is not a string', function () {
      delete event._doc.endsAt;
      expect(event.endsAt()).toBe(null);
    });

  });

});

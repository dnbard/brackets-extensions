var EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    events = require('../enums/events');

module.exports = _.extend(new EventEmitter(), {
    list: events
});

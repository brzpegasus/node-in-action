var events = require('events');

var channel = new events.EventEmitter();

channel.on('join', function() {
    console.log("Welcome!");
});

channel.emit('join');

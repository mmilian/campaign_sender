var EventEmitter = require('events').EventEmitter;

var server = new EventEmitter();

server.on('foo', function() {
  console.log('got foo');
});

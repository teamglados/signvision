const server = require('./server');
const http = require('./http');

// Collect api and streams
const { sendEvent } = server;
const { connections, messages, errors, options } = server;

// Subscribe to new connections
connections.subscribe(([ws, chan]) => {
  console.log(`* new connection channel ${chan} ${ws._socket.remoteAddress}`);
});

// Subscribe to messages
messages.subscribe(([evt, chan]) => {
  console.log(`* new event on channel ${chan}`, evt);
  sendEvent(chan, 'event_server', 'foo');
});

// TODO: Event handlers
//

console.log('>> WS server started on port', options.port);

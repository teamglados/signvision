const server = require('./server');

// Collect api
const { sendEvent } = server;

// Collect streams
const { connections, messages, errors, options } = server;

// Subscribe to new connections
connections.subscribe(([ws, chan]) => {
  console.log(`* new connection channel ${chan} ${ws._socket.remoteAddress}`);
})

// Subscribe to messages
messages.subscribe(([evt, chan]) => {
  console.log(`* new event on channel ${chan}`, evt);
  sendEvent(chan, 'event_server', 'foo');
})

// TODO: Event handlers
//

console.log('>> ws server started on port', options.port);

const server = require('./server');
const http = require('./http');

// Collect api and streams
const { sendEvent } = server;
const { connections, messages, errors, options } = server;

// Subscribe to new connections
connections.subscribe(([ws, chan]) => {
  console.log(`* [chan:${chan}] new connection ${ws._socket.remoteAddress}`);
});

// Subscribe to messages
messages.subscribe(([evt, chan]) => {
  console.log(`* [chan:${chan}] new event '${evt.type}' len=${JSON.stringify(evt).length}`);
});

// TODO: Event handlers
//

console.log('>> WS server started on port', options.port);

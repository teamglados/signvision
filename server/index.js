const server = require('./server');
const http = require('./http');

// Collect api and streams
const { sendEvent } = server;
const { connections, messages, errors, options } = server;

// New connections
connections.subscribe(([ws, chan]) => {
  console.log(`* [chan:${chan}] new connection ${ws._socket.remoteAddress}`);
});

// Event: all
messages.subscribe(([evt, chan]) => {
  console.log(`* [chan:${chan}] new event '${evt.type}' len=${JSON.stringify(evt).length}`);
});

// Event: capture image
messages
.filter(([evt, _]) => evt.type === 'MARK_CAPTURE')
.subscribe(([evt, chan]) => {
  console.log(evt.payload);
});

console.log('>> WS server started on port', options.port);

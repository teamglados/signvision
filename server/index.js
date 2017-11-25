const { connections, messages, errors, port } = require('./server');

console.log('>> ws server started on port', port);

// Subscribe to connections
connections.subscribe(x => {
  console.log('new connection:', x._socket.remoteAddress);
});

// Subscribe to messages
messages.subscribe(x => {
  console.log('new message:', x);
});

// TODO: Event handlers

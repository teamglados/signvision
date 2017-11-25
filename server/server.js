const { EventEmitter } = require('events');
const uWs = require('uws');
const Rx = require('rx');

// Create options
const { port = 3000 } = process.env;

// Create new ws server
const wss = new uWs.Server({ port });

// Create event emitter
const wse = new EventEmitter();

// Create observable connection, event and error streams
const connections = Rx.Observable.fromEvent(wse, 'connection');
const messages = Rx.Observable.fromEvent(wse, 'message');
const errors = Rx.Observable.fromEvent(wse, 'error');

// Attach connection, error listeners
wss.on('connection', conn => wse.emit('connection', conn));
wss.on('error', err => wse.emit('error', err));

// Subscribe to connections
connections.subscribe(ws => {
  ws.on('message', msg => wse.emit('message', JSON.parse(msg) || {}));
  ws.on('error', err => wse.emit('error', err));
});

// Export all
module.exports = {
  connections,
  messages,
  errors,
  port
};

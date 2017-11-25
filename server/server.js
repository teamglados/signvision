// Require libs
const { EventEmitter } = require('events');
const uWs = require('uws');
const Rx = require('rx');

// Require utils
const { createChannel, createPayload } = require('./utils');
const dedupe = require('./dedupe');

// Create options
const { port = 3000 } = process.env;

// Create options & channel storage
const options = { port };
const channels = {};

// Create new ws server
const wss = new uWs.Server(options);

// Create event emitter
const wse = new EventEmitter();

// Create observable connection, event and error streams
const connections = Rx.Observable.fromEvent(wse, 'connection');
const messages = Rx.Observable.fromEvent(wse, 'message');
const errors = Rx.Observable.fromEvent(wse, 'error');

// High level send function
const sendEvent = (chan, type, payload) => {
  if (channels[chan]) {
    channels[chan].send(JSON.stringify(createPayload({type, payload})));
  }
}

// Attach listeners
wss.on('connection', socket => {

  // Create new channel and save socket
  const chan = createChannel();
  channels[chan] = socket;

  // Acknowlege client channel
  sendEvent(chan, 'channel', chan);

  // Attach message listeners
  socket.on('message', evt => {
    evt = createPayload(evt);
    if (Object.keys(channels).indexOf(evt.chan) > -1 && dedupe(evt)) {
      wse.emit('message', [evt.data, evt.chan]);
    }
  });

  // Attach socket error listeners
  socket.on('error', err => {
    wse.emit('error', err);
  });

  // Emit connection
  wse.emit('connection', [socket, chan]);
});

// Export all
module.exports = {
  channels,
  connections,
  messages,
  errors,
  options,
  sendEvent,
};

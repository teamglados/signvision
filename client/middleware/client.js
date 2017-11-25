import Rx from 'rx';
import EventEmitter from 'events';
import dedupe from './dedupe';

// Returns payload object from input
export const createPayload = input => {
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    }
    catch(err) {
      input = {type: 'event', payload: input}
    }
  }
  return input;
}

// Returns socket instance with attached listeners
export const createListeners = (client, events, socket) => {

  // Connection open handler
  socket.onopen = evt => {
    console.log('* open connection');
  }

  // Message handler
  socket.onmessage = evt => {
    const { id, data } = createPayload(evt.data);
    if (data.type === 'channel') {
      return client.accept(data.payload);
    }
    if (dedupe(id)) {
      return events.emit('message', data);
    }
  }

  // Error handler
  socket.onerror = evt => {
    console.log('* error');
  }

  // Connection close handler
  socket.onclose = evt => {
    console.log('* closed connection');
    client.destroy();
  }

  return socket;
}

// Returns websocket client
export const createClient = host => {

  // Create new event emitter
  const events = new EventEmitter();

  // Create client object
  const client = {};
  client.channel = null;
  client.socket = null;
  client.messages = Rx.Observable.fromEvent(events, 'message');
  client.errors = Rx.Observable.fromEvent(events, 'error');

  // OK
  client.disconnect = () => {
    clearInterval(client.reconnect);
    if (client.socket) {
      client.socket.close();
      client.destroy();
    }
  }

  // OK
  client.connect = () => {
    try {
      client.disconnect();
      client.socket = createListeners(client, events, new WebSocket('ws://'+ host));
      // Auto-reconnect
      client.reconnect = setInterval(() => {
        if (!client.channel) {
          console.log('* retry connection');
          client.connect();
        }
      }, 2000);
    }
    catch (err) {
      console.log(err);
    }
  }

  // OK
  client.send = data => {
    if (client.socket && client.channel) {
      client.socket.send(JSON.stringify({
        ...createPayload(data),
        chan: client.channel,
        id: Math.random() * 1e17
      }));
    }
  }

  // OK
  client.accept = chan => {
    client.channel = chan;
    console.log('* got channel', chan);
  }

  // OK
  client.destroy = () => {
    delete client.channel;
    delete client.socket;
  }

  // OK
  return client;
}

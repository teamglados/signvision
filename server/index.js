const fs = require('fs');
const axios = require('axios');
const server = require('./server');
const http = require('./http');

// Base path
const { BASE_PATH = 'localhost:8000' } = process.env;

// Collect api and streams
const { sendEvent } = server;
const { connections, messages, errors, options } = server;

// Create history storage
const history = {};

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
.filter(([evt, _]) => evt.type === 'MARK_SEND')
.subscribe(([evt, chan]) => {

  const { payload } = evt;

  // IN:
  //   {
  //     id: 4575917962,
  //     timestamp: 1511649981213,
  //     lat: 60.299,
  //     lng: 24.2119,
  //     data: <base64>
  //   }

  // Let's hack it together
  if (payload.data) {

    // Create filename
    const filename = `/tmp/${payload.id}-full.jpg`;

    // Write base64 data to JPG file
    fs.writeFile(filename, payload.data, 'base64', err => {
      if (err) {
        return console.log(err);
      }

      // Log new image
      console.log(`* got new image ${filename}`);

      // Respond
      sendEvent(chan, 'MARK_RECEIVE', {
        id: payload.id,
        timestamp: +new Date(),
        lat: payload.lat,
        lng: payload.lng,
        image: `http://${BASE_PATH}/static/${payload.id}-full.jpg`,
        image_full: `http://${BASE_PATH}/static/${payload.id}-full.jpg`,
        probability: 0.95,
        valid: true
      });
    });
  }
});

console.log('>> WS server started on port', options.port);
console.log('-- base path:', BASE_PATH)

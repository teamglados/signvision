const saver = require('base64-img');
const axios = require('axios');
const server = require('./server');
const http = require('./http');

// Base path
const { BASE_PATH = 'localhost:8000' } = process.env;

// Collect api and streams
const { sendEvent } = server;
const { connections, messages, errors, options } = server;

// Create history storage
const history = {cooldown: 0};

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

  // Let's hack it together
  if (payload.data) {

    // Create filename
    // const filename = `/tmp/${payload.id}-full.jpg`;
    const filename = `${payload.id}-full`;

    // Write base64 data to JPG file
    saver.img('data:image/jpg;base64,'+payload.data, '/tmp', filename, (err, data) => {

      // Log error
      if (err) {
        return console.log(err);
      }

      // Log new image
      console.log(`* got new image ${filename}`);

      // Try predict
      axios
      .get(`http://localhost:8080/predict/${payload.id}`)
      .then(res => {

        // Compute cooldown
        const cooldown = (+new Date() - history.cooldown);

        // Should handle
        if (res.data.valid && cooldown > 5000) {
          sendEvent(chan, 'MARK_RECEIVE', {
            id: payload.id,
            timestamp: +new Date(),
            lat: payload.lat,
            lng: payload.lng,
            image: `http://${BASE_PATH}/static/${payload.id}.jpg`,
            image_full: `http://${BASE_PATH}/static/${payload.id}-full.jpg`,
            probability: 0,
            valid: true
          });

          history.cooldown = +new Date();
          console.log(`* [id:${payload.id}] valid=${res.data.valid}, cooldown=0`);
        }
        // Not handled
        else {
          console.log(`* [id:${payload.id}] valid=${res.data.valid}, cooldown=${cooldown}`);
        }
      })
      .catch(err => {
        console.log(err);
      })
    });
  }
});

console.log('>> WS server started on port', options.port);
console.log('-- base path:', BASE_PATH)

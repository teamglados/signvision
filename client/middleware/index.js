import { createClient } from './client';

// const wsUrl = '2fd5cbca.ngrok.io';
const wsUrl = 'ca5b2adf.ngrok.io';

// Export middleware function
export default () => store => {
  const client = createClient(wsUrl);
  const { messages } = client;

  // Connect to backend
  client.connect();

  // Subscribe to messages
  messages.subscribe(evt => {
    store.dispatch({ ...evt, server: true });
  });

  // Test
  // setInterval(() => {
  //   client.send({ type: 'client_event', payload: 'test' });
  // }, 2000);

  return next => action => {
    if (!action.server) {
      client.send(action);
    }
    return next(action);
  };
};

import { createClient } from './client';

const wsUrl = 'ec2-35-157-114-220.eu-central-1.compute.amazonaws.com:3000';

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

  return next => action => {
    if (!action.server) {
      client.send(action);
    }
    return next(action);
  };
};

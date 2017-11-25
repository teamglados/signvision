import { createClient } from './client';

// Export middleware function
export default () => {

  return store => {

    const client = createClient('localhost:3000');
    const { messages, errors } = client;

    // Connect to backend
    client.connect();

    // Subscribe to messages
    messages.subscribe(evt => {
      console.log('got event', evt);
      store.dispatch({...evt, server: true});
    });

    // Test
    setInterval(() => {
      client.send({type: 'client_event', payload: 'test'});
    }, 2000);

    return next => action => {
      if (!action.server) {
        client.send(action);
      }
      return next(action);
    };
  };
};

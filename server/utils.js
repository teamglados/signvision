// Returns new random id
const createId = () => {
  return Math.random() * 1e17
}

// Returns new random channel
const createChannel = () => {
  return Math.random().toString(36).substr(2, 16);
}

// Returns payload from input
const createPayload = input => {
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    }
    catch(err) {
      input = {type: 'event', payload: input}
    }
  }
  return {
    id: createId(),
    chan: input.chan || null,
    data: {type: input.type, payload: input.payload}
  };
}

// Export all
module.exports = {
  createId,
  createChannel,
  createPayload
}

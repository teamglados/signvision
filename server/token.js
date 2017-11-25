const jwt = require('jsonwebtoken');

// Collect statics
const { 
  JWT_SECRET = 'CWg3PU1A4gll3cIiAhLdP5RAjdUqJljy',
  JWT_EXPIRY = '365d'
} = process.env;

// Returns new token
const create = () => {
  return jwt.sign({data: 'foo'}, JWT_SECRET, {
    algorithm: 'RS256',
    expiresIn: JWT_EXPIRY
  });
}

// Returns null if token is invalid, payload otherwise
const verify = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch(err) {
    return null;
  }
}

// Export all
module.exports = {
  create,
  verify
}

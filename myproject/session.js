const crypto = require('crypto');

// Generate a 64-byte random string and convert it to hex
const sessionSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated Session Secret:', sessionSecret);

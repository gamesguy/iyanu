const crypto = require('crypto');

// Generate a 32-byte random string and convert it to hex
const otpSecret = crypto.randomBytes(32).toString('hex');

console.log('Generated OTP Secret:', otpSecret);

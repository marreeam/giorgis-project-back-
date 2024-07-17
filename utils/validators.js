const validator = require('validator');
//validate email
const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    return { valid: false, msg: 'Invalid email address' };
  }
  return { valid: true };
};
//validate username
const validateUsername = (username) => {
  if (!validator.isLength(username, { min: 3, max: 20 })) {
    return { valid: false, msg: 'Username must be between 3 and 20 characters long' };
  }
  if (!validator.isAlphanumeric(username)) {
    return { valid: false, msg: 'Username must only contain letters and numbers' };
  }
  return { valid: true };
};
//validate password
const validatePassword = (password) => {
  if (!validator.isLength(password, { min: 8 })) {
    return { valid: false, msg: 'Password must be at least 8 characters long' };
  }
  if (!validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })) {
    return { valid: false, msg: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character' };
  }
  return { valid: true };
};

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
};
const User = require("../models/User");

// Generate a unique username
const generateUsername = async (firstName, lastName) => {
  // 1. Create a base username: lowercase, remove spaces and non-alphanumeric characters
  let base = (firstName + lastName)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // only letters and numbers

  let username = base;
  let counter = 1;

  // 2. Check if username exists
  while (await User.exists({ username })) {
    username = base + counter;
    counter++;
  }

  return username;
};

module.exports = generateUsername;

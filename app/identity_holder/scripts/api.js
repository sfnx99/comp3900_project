import axios from 'axios';

const port = 8000;
const url = `http://localhost:${port}`;

/**
 * Registers a user in the wallet API.
 * @param {string} email - the email of user registering
 * @param {string} password - the password of the user registering
 * @returns bearer token on successful registration
 */
export const registerUser = async (email, password) => {
  const response = await axios.post(`${url}`, { email, password });
  return response.token;
};

import axios from 'axios';
import { WALLET_HOST, WALLET_PORT } from '@env';

const port = WALLET_PORT || 8082;
const url = `${WALLET_HOST || 'http://localhost'}:${port}`;

/**
 * Test connectivity with the backend.
 */
export const sanityCheck = async () => {
  try {
    const response = await axios.get(`${url}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

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

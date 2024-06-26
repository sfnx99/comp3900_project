import axios from 'axios';
import { WALLET_HOST, WALLET_PORT } from '@env';
import { save, getValueFor } from './util';

const port = WALLET_PORT || 7999;
const url = `${WALLET_HOST || 'http://localhost'}:${port}/v1`;

const getToken = async () => {
  try {
    const token = await getValueFor('token');
    console.log(token);
    if (!token) {
      throw new Error('Not authenticated for this session.');
    }
    return token;
  } catch (error) {
    console.error('Error retrieving auth token:', error);
    return null;
  }
};

const setToken = async (token) => {
  try {
    await save('token', token);
  } catch (error) {
    console.error('Could not save token:', error);
  }
};

const removeToken = async () => {
  try {
    // Clear token
    await save('token', '');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

/**
 * Handles error logging in the catch block for API calls to the
 * Wallet API.
 * @param {error} error - the error object from the catch block.
 */
const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.error);
  } else {
    console.error('API request failed:', error.message);
    throw new Error('An unknown error occurred. Please try again.');
  }
};

/**
 * Test connectivity with the Wallet API backend.
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
  try {
    const response = await axios.post(`${url}/auth/register`, { email, password });
    setToken(response.data.token);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Logs the user in the Wallet API.
 * @param {string} email - the email of the user logging in
 * @param {string} password - the password of the user logging in
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${url}/auth/login`, { email, password });
    setToken(response.data.token);
  } catch (error) {
    handleError(error);
  }
};

/**
 * Send a request to the Wallet API to logout the user.
 */
export const logoutUser = async () => {
  try {
    const token = await getToken();
    console.log('Token to logout:', token);
    await axios.post(`${url}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    removeToken();
  } catch (error) {
    handleError(error);
  }
};

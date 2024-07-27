import axios from 'axios';
import * as Linking from 'expo-linking';
import { save, getValueFor, deleteItem } from './util';

const port = process.env.WALLET_PORT || 8081;
const url = `${process.env.WALLET_HOST || 'http://localhost'}:${port}/v2`;

const getToken = async () => {
  try {
    const token = await getValueFor('token');
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

export const removeToken = async () => {
  try {
    // Clear token
    await deleteItem('token');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

/**
 * Checks if the token is still valid for the session.
 * @returns boolean determining the validity of the session.
 */
export const tokenActive = async () => {
  const token = await getValueFor('token');
  if (token) { return true; }
  return false;
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
    const { token } = response.data;

    if (token) {
      setToken(token);
    } else {
      throw new Error('Token is empty.');
    }
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

/**
 * Retrieve list of user credential IDs
 * @returns array of credential ids
 */
export const getCredentials = async () => {
  try {
    const token = await getToken();
    const response = await axios.get(`${url}/credentials`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.credentials;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const getCredential = async (id) => {
  try {
    const token = await getToken();
    const response = await axios(`${url}/credential?credential_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

/**
 * Deletes the credential through the wallet API.
 * @param {string} credential_id - the id of the credential to be deleted.
 */
export const deleteCredential = async (credentialId) => {
  try {
    const token = await getToken();
    await axios.delete(`${url}/credential`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { credential_id: credentialId },
    });
  } catch (error) {
    handleError(error);
  }
};

export const getPresentation = async (verifierUri) => {
  try {
    const token = await getToken();
    const response = await axios(`${url}/present?verifier_uri=${verifierUri}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const postPresentation = async (credentialId, verifierUri) => {
  try {
    const token = await getToken();
    await axios(`${url}/present`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { credential_id: credentialId, verifier_uri: verifierUri },
    });
  } catch (error) {
    handleError(error);
  }
};

export const getIssuers = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }
    const response = await axios.get(`${url}/issuers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const getIssue = async (issuer) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }

    // Make the API call with the issuer parameter
    const response = await axios.get(`${url}/issue`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        issuer_id: issuer,
      },
    });
    if (response.status !== 200) {
      throw new Error(`Failed to fetch data: Status ${response.status}`);
    }

    return response.data;
  } catch (error) {
    handleError(error);
    return { error: true, message: error.message };
  }
};

export const IssueRegisterUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email or password is not available in the session.');
    }

    await axios.post('http://localhost:8082/v2/register', { email, password });

    // No need to handle the token, as the response is not expected to return anything
  } catch (error) {
    handleError(error);
  }
};



export const AuthorizeIssue = async (response_type, email, URL, state, selectedDetail) => {
  try {
    // Construct the code URL with dynamic parameters
    const codeURL = `https://ablac.dev:8443/v2/authorize/?response_type=${response_type}&client_id=${email}&redirect_uri=${encodeURIComponent(URL)}&state=${state}&scope=${selectedDetail}`;
    
    const response = await axios.get(codeURL);

    // Assuming the response contains a successful status or data you need
    if (response.status === 200) {
      // Redirecting to the constructed code URL using Linking
      Linking.openURL(codeURL);
    } else {
      console.log('Unexpected response:', response);
    }
  } catch (error) {
    console.error('Error making GET request:', error);
  }
};
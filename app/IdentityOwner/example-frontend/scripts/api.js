import axios from 'axios';
import { WALLET_HOST, WALLET_PORT, ISSUER_HOST } from '@env';

import * as Linking from 'expo-linking';
import { save, getValueFor, deleteItem } from './util';

const port = WALLET_PORT || 8081;
const url = `http://${WALLET_HOST || '192.168.4.22'}:${port}/v2`;
const host = `http://${WALLET_HOST || '192.168.4.22'}`;

//Auth Token Functions
const getToken = async () => {
  try {
    const token = await getValueFor('token');
    if (!token) {
      throw new Error('Not authenticated for this session.');
    }
    return token;
  } catch (error) {
    return null;
  }
};

const setToken = async (token) => {
  try {
    await save('token', token);
  } catch (error) {
  }
};

export const removeToken = async () => {
  try {
    await deleteItem('token');
  } catch (error) {
  }
};

export const tokenActive = async () => {
  const token = await getValueFor('token');
  return !!token;
};

const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.error);
  } else {
    throw new Error('An unknown error occurred. Please try again.');
  }
};

export const sanityCheck = async () => {
  try {
    await axios.get(`${url}`);
  } catch (error) {
  }
};
// REGISTER USER
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${url}/auth/register`, { email, password });
    setToken(response.data.token);
  } catch (error) {
    handleError(error);
  }
};
//LOGIN USER
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
// LOGOUT USER
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
// FETCH CREDENTIALS
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
// GET INDIVIDUAL CREDENTIAL
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
// DELETE A CREDENTIAL
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

/**
 * Gets the required attributes and credential type from a
 * given url.
 * @param {string} verifierUri - url
 * @returns object of the presentation data.
 */
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

/**
 * Presents a credential to a url.
 * @param {string} credentialId - id of the credential being presented
 * @param {string} verifierUri - the url the credential is presenting to
 */
export const postPresentation = async (credentialId, verifierUri) => {
  try {
    const token = await getToken();
    await axios.post(`${url}/present`, {
        credential_id: credentialId,
        verifier_uri: verifierUri,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  } catch (error) {
    handleError(error);
  }
};
// GETS THE ISSUERS
export const getIssuers = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }
    const response = await axios.get(`${host}:8081/v2/issuers`, {
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
// GETS DETAILS OF SINGLE ISSUER
export const getIssue = async (issuer) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }

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
// POSTS NEW ISSUE
export const IssueRegisterUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email or password is not available in the session.');
    }

    await axios.post('http://localhost:8082/v2/register', { email, password });
  } catch (error) {
    handleError(error);
  }
};
// AUTHORIZES NEW ISSUE
export const AuthorizeIssue = async (response_type, email, URL, selectedDetail) => {
  try {
    // const issueURL = `https://${ISSUER_HOST || 'ablac.dev'}:${ISSUER_PORT || 8082}`
    // const codeURL = `${issueURL}/v2/authorize/?response_type=${response_type}&client_id=${email}&redirect_uri=${encodeURIComponent(URL)}&state=xys&scope=${selectedDetail}`;
    const codeURL = `http://${ISSUER_HOST || 'ablac.dev'}:8082/v2/authorize/?response_type=${response_type}&client_id=${email}&redirect_uri=${encodeURIComponent(URL)}&state=xys&scope=${selectedDetail}`;
    const response = await axios.get(codeURL);
    if (response.status === 200) {
      Linking.openURL(codeURL);
    }
  } catch (error) {
    handleError(error);
  }
};
// POSTS AN ISSUE
export const PostIssue = async (issuer, code, redirect, types) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }

    const response = await axios.post(`${url}/issue`, {
      issuer_id: issuer,
      auth_code: code,
      redirect_uri: redirect,
      type: types,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
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

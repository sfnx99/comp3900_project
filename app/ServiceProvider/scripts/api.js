import axios from 'axios';
import { SERVICE_PROVIDER_HOST, SERVICE_PROVIDER_PORT } from '@env';
import { save, getValueFor, deleteItem } from './util';

const port = SERVICE_PROVIDER_PORT || 8083;
const url = `http://${SERVICE_PROVIDER_HOST || '192.168.4.22'}:${port}/v2`;
const host = `http://${SERVICE_PROVIDER_HOST || '192.168.4.22'}`;


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

export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${host}:8081/v2/auth/register`, { email, password });
    setToken(response.data.token);
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${host}:8081/v2/auth/login`, { email, password });
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

export const getIssuers = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }
    const response = await axios.get(`${host}:8082/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.did_uri;
  } catch (error) {
    return null;
  }
};

export const trustIssuer = async (issuer) => {
  try {
    const response = await axios.post(`${url}/trust`, {
      id: issuer
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const PostDefinition = async (type, issuer, requiredAttributes) => {
  try {
    const response = await axios.post(`${url}/definition`, {
      type,
      issuer,
      requiredAttributes
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
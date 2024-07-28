import axios from 'axios';
import { WALLET_HOST, WALLET_PORT } from '@env';
import { save, getValueFor, deleteItem } from './util';

const port = process.env.WALLET_PORT || 8083;
const url = `${process.env.WALLET_HOST || 'http://localhost'}:${port}/v2`;



export const getIssuers = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('Authentication required.');
    }
    const response = await axios.get(`http://ablac.dev:8082/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const trustIssuer = async (issuer) => {
  try {
    const response = await axios.post(`${url}/trust`, {
      issuer
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const PostDefinition = async (type, issuer, requiredAttributes) => {
  try {
    const response = await axios.post(`${url}/trust`, {
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
import axios from 'axios';
import { WALLET_HOST, WALLET_PORT } from '@env';
import { save, getValueFor, deleteItem } from './util';

// const port = 8082;
const url = `http://ablac.dev:8082/v2`;


export const IssueRegisterUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error('Email or password is not available.');
    }

    const response = await axios.post(`${url}/register`, { email, password });

    if (response.status !== 200) {
      throw new Error(`Registration failed with status code ${response.status}.`);
    }

    return response.data; 

  } catch (error) {
    console.error('Registration error:', error.message);
    throw error; // Re-throw the error after logging it
  }
};


export const PostInformation = async (email, fname, lname, dob) => {
  try {
    if (!email || !fname || !lname || !dob) {
      throw new Error('A field is missing');
    }

    const response = await axios.post(`${url}/info`, { email, fname, lname, dob });

    if (response.status !== 200) {
      throw new Error(`Registration failed with status code ${response.status}.`);
    }

    return response.data; 

  } catch (error) {
    console.error('Registration error:', error.message);
    throw error; // Re-throw the error after logging it
  }
};
import axios from 'axios';
import { ISSUER_HOST, ISSUER_PORT } from '@env';
import { save, getValueFor, deleteItem } from './util';

const port = ISSUER_PORT || 8082;
const url = `http://${ISSUER_HOST || '172.20.10.10'}:${port}/v2`;

//Issue user API call
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
//POST INFO API CALL
export const PostInformation = async (email, fname, lname, dob) => {
  try {
    if (!email || !fname || !lname || !dob) {
      throw new Error('A field is missing');
    }

    const response = await axios.post(`${url}/info`, { email, info: {firstName: fname, lastName: lname, dob} });

    if (response.status !== 200) {
      throw new Error(`Registration failed with status code ${response.status}.`);
    }

    return response.data;
} catch (error) {
    console.error('Registration error:', error.message);
    throw error; // Re-throw the error after logging it
  }
};
// Get Credentials API Call
export const getCredentials = async () => {
  try {
    const response = await axios.get(`${url}/credentials`);
    return response.data;
  } catch (error) {
    console.error('Error fetching credentials:', error.message);
    throw error;
  }
};
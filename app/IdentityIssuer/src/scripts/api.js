import { redirect } from "react-router-dom";
const IPconfig = require('../config.json')
const IPaddress = IPconfig.IPaddress;
// const issuer_url = `http://${IPaddress}:8082`;
const issuer_url = `http://localhost:8082`;

const wallet_url = `http://${IPaddress}:8081`;
const verifier_url = `http://${IPaddress}:8083`;

import axios from 'axios';


// Function to get the token from local storage
export const getToken = async () => {
  try {
    console.log(issuer_url)
    const response = await fetch(`${issuer_url}/`);
    console.log("HELLO")
    if (!response.ok) {
      throw new Error('Failed to fetch token');
    }
    const data = await response.json();
    const token = data.did_uri;
    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const token = await getToken(); // Await the getToken function
    const response = await fetch(`${issuer_url}/v2/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_id: email, 
        admin_secret: password, // Assuming password is used as admin_secret
        did_url: token, 
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Invalid credentials');
    }
    console.log(response.status)
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};


export const register = async (email, password) => {
  try {
    const response = await fetch(`${issuer_url}/v2/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const registerOwner = async (email, password) => {
  try {
    const response = await fetch(`${issuer_url}/v2/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, wallet_url, state: 'xyz', scope: 'UNSWCredential' }),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    // const data = await response.json();
    return response;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

// export const fetchCredentialById = async (id) => {
//   try {
//     const token = getToken();
//     const response = await fetch(`${issuer_url}/v2/view-credential/${id}`, {
//       headers: {
//         'Cache-Control': 'no-cache',
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching credential:', error);
//     throw error;
//   }
// };

export const fetchCredentialByName = async (name) => {
  try {
    const token = await getToken(); 
    console.log('Fetching credential with name:', name);
    const response = await fetch(`${issuer_url}/v2/credential-logs`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('API response status:', response.status);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched credential data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching credential:', error);
    throw error;
  }
};
export const fetchCredentialsList = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/v2/list-credentials`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching credentials list:', error);
    throw error;
  }
};

export const addCredential = async (credentialData) => {
  try {
    const token = await getToken();
    const response = await fetch(`${issuer_url}/v2/add-credential`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(credentialData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding credential:', error);
    throw error;
  }
};

export const setUNSWCredentialFormat = async () => {
  try {
      const res = await axios.post(issuer_url + "/v2/format", {
          type: "UNSWCredential",
          attributes: ["firstName", "lastName", "zID", "dob", "USI", "faculty", "expiryDate", "program", "COMP3900Grade"]
      });
      if (res.status !== 200) {
          throw new Error('Failed to set UNSWCredential format');
      }
      console.log('Successfully set UNSWCredential format');
  } catch (error) {
      console.error('Error setting UNSWCredential format:', error);
      throw error;
  }
};

export const addMockApplication = async (applicationBody) => {
  try {
    const token = await getToken();
    const response = await fetch(`${issuer_url}/v2/add-mock-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(applicationBody), // Include the applicationBody in the request body
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding mock application:', error);
    throw error;
  }
};

export const fetchApplications = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/v2/applications`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const fetchApplicationById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/v2/application/${id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
};

export const authorizeCredential = async (application) => {
  try {
    const token = await getToken();

    const requestBody = {
      application: application,
      issuer_did: token,
      client_id: application.client_id,
      client_secret: '1234',
      redirect_uri: wallet_url,
      state: 'xyz',
      scope: 'UNSWCredential',
    };

    const authResponse = await fetch(`${issuer_url}/v2/authorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!authResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await authResponse.json();
    console.log('Authorization response:', data);
    return data;
  } catch (error) {
    console.error('Error authorizing credential:', error);
    throw error;
  }
};

export const issueCredToClient = async (client_id, client_secret, redirect_uri, state, scope) => {
  try {
    const token = await getToken();

    const requestBody = {
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      state: state,
      scope: scope,
    };

    const authResponse = await fetch(`${issuer_url}/v2/authorize/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!authResponse.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await authResponse.json();
    console.log('Authorization response:', data);
    return data;
  } catch (error) {
    console.error('Error authorizing credential:', error);
    throw error;
  }
};

export const saveAuthCode = async (auth_code) => {
  try {
    const token = await getToken();
    console.log('Token:', token);
    console.log('Auth code to save:', auth_code);

    const response = await fetch(`${issuer_url}/v2/save-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ auth_code }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error saving auth code:', error);
    throw error;
  }
};

export const getAuthCode = async () => {
  try {
    const token = await getToken();
    const response = await fetch(`${issuer_url}/v2/get-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting auth code:', error);
    throw error;
  }
};


export const sendInfo = async (email, info) => {
  try {
    const token = await getToken();
    const response = await fetch(`${issuer_url}/v2/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, info }),
    });

    console.log('info:', info);
    console.log('email:', email);
    console.log('res:', response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error('Error sending info:', error);
    throw error;
  }
};

export const setIssuer = async (issuerName) => {
  try {
    const token = await getToken();
    const response = await axios.post(`${issuer_url}/v2/name`, {
      name: issuerName
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting issuer name:', error);
    throw error;
  }
};

export const fetchCredentialLogs = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/v2/credential-logs`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching credential logs:', error);
    throw error;
  }
};


export const deleteCredentialById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/cred/${id}`, {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return true;
  } catch (error) {
    console.error('Error deleting credential:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${issuer_url}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    localStorage.removeItem('token');
    console.log('Token removed from local storage');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const fetchNotifications = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${issuer_url}/auth/notifications`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };
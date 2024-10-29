const API_BASE_URL = 'http://localhost:9000';

// Function to get the token from local storage
const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Log the token
  return token;
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    const data = await response.json();
    // Store the token in local storage
    localStorage.setItem('token', data.token);
    console.log('Token stored:', data.token); // Log the stored token
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

export const fetchCredentialById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cred/${id}`, {
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
    console.error('Error fetching credential:', error);
    throw error;
  }
};

export const fetchCredentialsList = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cred/list`, {
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
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cred/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(credentialData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding credential:', error);
    throw error;
  }
};

export const deleteCredentialById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/cred/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
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
      const response = await fetch(`${API_BASE_URL}/auth/notifications`, {
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
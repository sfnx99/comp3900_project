import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
// import { logout } from '../scripts/api'; 

function ProfilePage() {
  const navigate = useNavigate();
  const handleRequestAccountDeletion = () => {
    console.log('Request Account Deletion');
  };

  const handleLogout = async () => {
    try {
      // await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.header}>Profile Page</h1>
        <p style={styles.description}>Learn more about us on this page.</p>
        <div style={styles.settingsContainer}>
          <button onClick={handleRequestAccountDeletion} style={styles.button}>Request Account Deletion</button>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: '0px 100px',
  },
  container: {
    flex: 1,
    padding: '20px', 
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '1.25em', 
    color: '#001f3f', 
    textAlign: 'center',
    marginBottom: '10px', 
  },
  description: {
    fontSize: '0.6em', 
    color: '#333',
    textAlign: 'center',
    marginBottom: '10px', 
  },
  settingsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '10px', 
    fontSize: '0.6em', 
    color: '#fff',
    backgroundColor: '#001f3f', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s',
  },
};

export default ProfilePage;
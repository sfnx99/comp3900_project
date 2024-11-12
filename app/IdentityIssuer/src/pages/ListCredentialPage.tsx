import React, { useState, useEffect, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fetchCredentialsList } from '../scripts/api'; 

interface Credential {
  id: string;
  credentialName: string;
}

function ListCredentialPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const data = await fetchCredentialsList();
        console.log('Fetched credentials:', data); 
        setCredentials(data);
      } catch (error) {
        console.error('Error fetching credentials:', error);
      }
    };

    getCredentials();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.header}>View Published Credentials</h1>
        <p style={styles.description}>Page to view, edit and see information on valid credentials</p>
        <div style={styles.credentialsContainer}>
          {credentials.map((credential) => (
            <Link to={`/credential/${credential.id}`} key={credential.id} style={styles.credentialBox}>
              {credential.credentialName}
            </Link>
          ))}
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
  credentialsContainer: {
    display: 'flex',
    padding: '20px',
    flexDirection: 'column',
    gap: '10px',
  },
  credentialBox: {
    padding: '10px 20px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: '0.6em', 
    textDecoration: 'none',
    color: '#333',
  },
};

export default ListCredentialPage;
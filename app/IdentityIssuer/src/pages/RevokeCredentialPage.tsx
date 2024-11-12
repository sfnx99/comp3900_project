import React, { useState, useEffect, CSSProperties } from 'react';
import { fetchCredentialLogs } from '../scripts/api'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface CredentialLog {
  client_id: string;
  type: string;
  cryptosuite: string;
  credential: { [key: string]: string };
}

function RevokeCredentialPage() {
  const [credentialLogs, setCredentialLogs] = useState<CredentialLog[]>([]);

  useEffect(() => {
    const getCredentialLogs = async () => {
      try {
        const data = await fetchCredentialLogs();
        setCredentialLogs(data);
      } catch (error) {
        console.error('Error fetching credential logs:', error);
        toast.error('Error fetching credential logs.');
      }
    };

    getCredentialLogs();
  }, []);

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Revoke Credential</h1>
      <div style={styles.logsContainer}>
        {credentialLogs.map((log, index) => (
          <div key={index} style={styles.logBox}>
            <p><strong>First Name:</strong> {log.credential.firstName}</p>
            <p><strong>Last Name:</strong> {log.credential.lastName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    margin: '0 100px',
    padding: '20px 400px', 
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9',
    minHeight: '70vh',
  },
  header: {
    fontSize: '1.25em', 
    color: '#001f3f', 
    textAlign: 'center',
    marginBottom: '10px', 
  },
  logsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  logBox: {
    padding: '10px 20px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'left',
    fontSize: '0.8em', 
  },
};

export default RevokeCredentialPage;
import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { fetchCredentialById, deleteCredentialById } from '../scripts/api';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface CredentialField {
  name: string;
  value: string;
}

interface Credential {
  id: string;
  fields: CredentialField[];
  validityPeriod: string;
}

function ViewCredentialPage() {
  const { id } = useParams<{ id: string }>();
  const [credential, setCredential] = useState<Credential | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCredential = async () => {
      try {
        const data = await fetchCredentialById(id);
        setCredential(data);
      } catch (error) {
        console.error('Error fetching credential:', error);
      }
    };

    getCredential();
  }, [id]);

  const handleDelete = async () => {
   

    try {
      await deleteCredentialById(id);
      toast.info('Request has been sent. Check for updates on the notification tab.');
      setTimeout(() => {
        toast.success('Credential removed successfully. Check the notification tab for more details.');
      }, 5000); 
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error('Error deleting credential.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <ToastContainer />
      <div style={styles.container}>
        <h2 style={styles.header}>{credential ? credential.fields.find(field => field.name === 'Name of Credential')?.value : 'Loading...'}</h2>
        {credential ? (
          <div>
            <div style={styles.qrCodeContainer}>
              <QRCodeSVG value={credential.id} size={150} />
            </div>
            <div style={styles.fieldsContainer}>
              {credential.fields.map((field, index) => (
                <div key={index} style={styles.field}>
                  <strong>{field.name}:</strong> {field.value}
                </div>
              ))}
              <div style={styles.field}>
                <strong>Validity Period:</strong> {credential.validityPeriod} months
              </div>
            </div>
            <div style={styles.buttonContainer}>
              <button onClick={handleDelete} style={styles.deleteButton}>
                <FaTrash style={styles.icon} /> Delete Credential
              </button>
            </div>
          </div>
        ) : (
          <p style={styles.loadingText}>Loading credential...</p>
        )}
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
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  fieldsContainer: {
    marginBottom: '20px',
  },
  field: {
    marginBottom: '10px',
    fontSize: '0.6em', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  deleteButton: {
    padding: '10px',
    fontSize: '0.6em',
    color: '#fff',
    backgroundColor: '#ff4d4d',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto', 
  },
  icon: {
    marginRight: '5px',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '0.6em', 
    color: '#666',
  },
};

export default ViewCredentialPage;
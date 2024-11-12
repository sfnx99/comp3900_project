import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { deleteCredentialById, getToken, issueCredToClient, getAuthCode } from '../scripts/api';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const wallet_url = "http://localhost:8081";

interface Credential {
  id: string;
  format: string;
  attributes: { [key: string]: string };
}

function ViewCredentialPage() {
  const navigate = useNavigate();

  const [qrCodeValue, setQrCodeValue] = useState<string>('');
  const [issuer_did, setissuer_did] = useState<string>('');

  const handleQrCodeClick = async () => {
    try {
      const auth_code = await getAuthCode();
      console.log('Authorization successful, auth code:', auth_code);

      console.log('Information sent successfully');

      const qrCodeData = {
        issuer_id: issuer_did,
        auth_code: auth_code.auth_code, 
        redirect_uri: wallet_url, 
        type: 'UNSWCredential' 
      };
      setQrCodeValue(JSON.stringify(qrCodeData));
      console.log('QR code data:', qrCodeData);

    } catch (error) {
      console.error('Authorization failed:', error);
      toast.error('Authorization failed.');
    }
  };

  useEffect(() => {
    const fetchissuer_did = async () => {
      const issuer_did = await getToken();
      setissuer_did(issuer_did);
    };
    fetchissuer_did();
  }, []);

  const handleDelete = async () => {
    try {
      toast.info('Request has been sent. Check for updates on the notification tab.');
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast.error('Error deleting credential.');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <ToastContainer />
      <div style={styles.container}>
        <h2 style={styles.header}>{'UNSW Credential'}</h2>
        <div>
          <div style={styles.fieldsContainer}>
            <div style={styles.field}>
              <strong>Type:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>First Name:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>Last Name:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>zID:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>Date of Birth:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>USI:</strong> {}
            </div>
            <div style={styles.field}>
              <strong>Expiry Date:</strong> {}
            </div>
          </div>
          <div style={styles.qrCodeContainer} onClick={handleQrCodeClick}>
            <QRCodeSVG value={qrCodeValue} size={150} />
          </div>
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
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    cursor: 'pointer',
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
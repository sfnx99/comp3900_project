import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { deleteCredentialById, getToken, getAuthCode, fetchCredentialByName } from '../scripts/api';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
const wallet_url = "http://localhost:8081";

interface Credential {
  client_id: string;
  firstName: string;
  lastName: string;
  dob: string;
  USI: string;
  expiryDate: string;
  zID: string;
}

function ViewCredentialPage() {
  const navigate = useNavigate();

  const [qrCodeValue, setQrCodeValue] = useState<string>('');
  const [issuer_did, setissuer_did] = useState<string>('');
  const [credential, setCredential] = useState<Credential | null>(null);

  useEffect(() => {
    const fetchissuer_did = async () => {
      const issuer_did = await getToken();
      setissuer_did(issuer_did);
    };

    const fetchCredential = async () => {
      try {
        const credentialData = await fetchCredentialByName('UNSWCredential');
        console.log('Fetched credential:', credentialData);
        if (credentialData.length > 0) {
          const credential = credentialData[0].credential; 
          setCredential(credential);
        } else {
          console.error('No credentials found');
          toast.error('No credentials found.');
        }
      } catch (error) {
        console.error('Failed to fetch credential:', error);
        toast.error('Failed to fetch credential.');
      }
    };

    const generateQrCode = async () => {
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

    fetchissuer_did();
    fetchCredential();
    generateQrCode();
  }, [issuer_did]);

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
        <div style={styles.card}>
          <div style={styles.fieldsContainer}>
            <div style={styles.field}>
              <strong>First Name:</strong> {credential?.firstName}
            </div>
            <div style={styles.field}>
              <strong>Last Name:</strong> {credential?.lastName}
            </div>
            <div style={styles.field}>
              <strong>zID:</strong> {credential?.zID}
            </div>
            <div style={styles.field}>
              <strong>Date of Birth:</strong> {credential?.dob}
            </div>
            <div style={styles.field}>
              <strong>USI:</strong> {credential?.USI}
            </div>
            <div style={styles.field}>
              <strong>Expiry Date:</strong> {credential?.expiryDate}
            </div>
          </div>
          <div style={styles.qrCodeContainer}>
            <QRCodeSVG value={qrCodeValue} size={200} />
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
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    margin: '0px 100px',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '1.5em',
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: '20px',
  },
  card: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    marginTop: '20px',
  },
  fieldsContainer: {
    marginBottom: '20px',
  },
  field: {
    marginBottom: '10px',
    fontSize: '1em',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  deleteButton: {
    padding: '10px',
    fontSize: '1em',
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
    fontSize: '1em',
    color: '#666',
  },
};

export default ViewCredentialPage;
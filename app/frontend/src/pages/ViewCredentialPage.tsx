import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { deleteCredentialById } from '../scripts/api';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Credential {
  id: string;
  format: string;
  attributes: { [key: string]: string };
}

function ViewCredentialPage() {
  const navigate = useNavigate();

  // Hardcoded credential data
  const credential: Credential = {
    id: '123456',
    format: 'UNSWCredential',
    attributes: {
      firstName: '',
      lastName: '',
      zID: '',
      dob: '',
      USI: '',
      faculty: '',
      expiryDate: '',
      program: 'Software Engineering',
      COMP3900Grade: 'HD'
    }
  };

  const [qrCodeValue, setQrCodeValue] = useState<string>('');

  useEffect(() => {
    // Generate QR code value based on hardcoded credential data
    setQrCodeValue(JSON.stringify(credential));
  }, []);

  const handleDelete = async () => {
    try {
      await deleteCredentialById(credential.id);
      toast.info('Request has been sent. Check for updates on the notification tab.');
      setTimeout(() => {
        toast.success('Credential removed successfully. Check the notification tab for more details.');
        navigate('/credentials/list'); // Navigate to the credentials list page after deletion
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
        <h2 style={styles.header}>{'UNSW Credential'}</h2>
        <div>
          <div style={styles.fieldsContainer}>
            <div style={styles.field}>
              <strong>Type:</strong> {credential.format}
            </div>
            <div style={styles.field}>
              <strong>First Name:</strong> {credential.attributes.firstName}
            </div>
            <div style={styles.field}>
              <strong>Last Name:</strong> {credential.attributes.lastName}
            </div>
            <div style={styles.field}>
              <strong>zID:</strong> {credential.attributes.zID}
            </div>
            <div style={styles.field}>
              <strong>Date of Birth:</strong> {credential.attributes.dob}
            </div>
            <div style={styles.field}>
              <strong>USI:</strong> {credential.attributes.USI}
            </div>
            <div style={styles.field}>
              <strong>Faculty:</strong> {credential.attributes.faculty}
            </div>
            <div style={styles.field}>
              <strong>Expiry Date:</strong> {credential.attributes.expiryDate}
            </div>
            <div style={styles.field}>
              <strong>Program:</strong> {credential.attributes.program}
            </div>
            <div style={styles.field}>
              <strong>COMP3900 Grade:</strong> {credential.attributes.COMP3900Grade}
            </div>
            <div style={styles.field}>
              <strong>Unique ID:</strong> {credential.id}
            </div>
          </div>
          <div style={styles.qrCodeContainer}>
            <QRCodeSVG value={qrCodeValue} size={150} />
          </div>
          <div style={styles.buttonContainer}>
            <button onClick={handleDelete} style={styles.deleteButton}>
              <FaTrash style={styles.icon} /> Delete Credential
            </button>
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
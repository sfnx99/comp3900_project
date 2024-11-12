import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchApplicationById, authorizeCredential } from '../scripts/api'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  USI: string;
  faculty: string;
  expiryDate: string;
  program: string;
  COMP3900Grade: string;
  zID: string;
  credentialType: string;
  credentialId: string; // Add credentialId to the Application interface
}

const AuthorizeCredentialPage = () => {
    const [application, setApplication] = useState<Application | null>(null);
    const { id } = useParams();
    const navigate = useNavigate();
  
    useEffect(() => {
      const getApplication = async () => {
        try {
          const data = await fetchApplicationById(id);
          console.log('Authorized Credential:', data);
          setApplication(data);
        } catch (error) {
          console.error('Error fetching application:', error);
          toast.error('Error fetching application.');
        }
      };
  
      getApplication();
    }, [id]);
  
    const handleAuthorize = async () => {
      try {
        const data = await authorizeCredential(application);
        toast.success('Credential authorized successfully.');
        console.log('Authorized Credential:', data);
        navigate('/issue-credentials');
      } catch (error) {
        console.error('Error authorizing credential:', error);
        toast.error('Error authorizing credential.');
      }
    };
  
    const handleDecline = () => {
      toast.info('Credential declined.');
      navigate('/issue-credentials');
    };
  
    if (!application) {
      return <p>Loading application...</p>;
    }
  
    return (
      <div style={styles.container}>
        <ToastContainer />
        <h1 style={styles.header}>Authorize Credential</h1>
        <div>
          <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
          <p><strong>Type:</strong> {application.credentialType}</p>
          <p><strong>DOB:</strong> {application.dob}</p>
          <p><strong>USI:</strong> {application.USI}</p>
          <p><strong>Faculty:</strong> {application.faculty}</p>
          <p><strong>Expiry Date:</strong> {application.expiryDate}</p>
          <p><strong>Program:</strong> {application.program}</p>
          <p><strong>COMP3900 Grade:</strong> {application.COMP3900Grade}</p>
          <p><strong>zID:</strong> {application.zID}</p>
          <div style={styles.buttonContainer}>
            <button onClick={handleAuthorize} style={styles.acceptButton}>Accept</button>
            <button onClick={handleDecline} style={styles.declineButton}>Decline</button>
          </div>
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
    textAlign: 'center',
  },
  header: {
    fontSize: '1.25em', 
    color: '#001f3f', 
    marginBottom: '10px', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  acceptButton: {
    padding: '10px 20px', 
    fontSize: '0.8em', 
    color: '#fff',
    backgroundColor: '#4CAF50', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  declineButton: {
    padding: '10px 20px', 
    fontSize: '0.8em', 
    color: '#fff',
    backgroundColor: '#f44336', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AuthorizeCredentialPage;
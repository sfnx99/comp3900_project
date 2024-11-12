import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApplications } from '../scripts/api'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  credentialType: string;
}

function IssueCredentials() {
  const [applications, setApplications] = useState<Application[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getApplications = async () => {
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Error fetching applications.');
      }
    };

    getApplications();
  }, []);

  const handleBoxClick = (id: string) => {
    navigate(`/credential/authorize/${id}`);
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Issue Credentials</h1>
      <div style={styles.applicationsContainer}>
        {applications.map((application) => (
          <div key={application.id} style={styles.applicationBox} onClick={() => handleBoxClick(application.id)}>
            <p><strong>Name:</strong> {application.firstName} {application.lastName}</p>
            <p><strong>Type:</strong> {application.credentialType}</p>
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
  applicationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  applicationBox: {
    padding: '10px 20px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    textAlign: 'left',
    fontSize: '0.8em', 
    cursor: 'pointer',
  },
};

export default IssueCredentials;
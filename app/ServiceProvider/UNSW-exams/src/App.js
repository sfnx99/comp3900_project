import { QRCodeCanvas } from 'qrcode.react';
import React, { useState, useEffect } from 'react';
import './App.css';
import config from './config.json';
import axios from 'axios';

function App() {
  const [qrData, setQrData] = useState('');
  const [error, setError] = useState(null);
  const [isDefined, setIsDefined] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [students, setStudents] = useState([]);

  // Effect to initialize issuer trust and define presentation
  useEffect(() => {
    const initializeIssuerTrustAndDefinePresentation = async () => {
      try {
        // Step 1: Initialize Issuer Trust
        const issuer_get = await fetch(config.issuer_url, {
          method: 'GET',
        });
        
        if (!issuer_get.ok) {
          throw new Error('Failed to fetch DID');
        }
        
        const issuerData = await issuer_get.json();
        console.log("issuer_did", issuerData.did_uri);
  
        const issuer_did = issuerData.did_uri;
        const verifier_url = config.verifier_url;
  
        // Call the backend to initialize trust
        await axios.post(`http://localhost:8083/initialize`, {
          issuer_did,
          verifier_url,
        });
  
        setIsInitialized(true);
        console.log("Issuer trusted successfully");
  
        // Step 2: Define Requested Presentation
        console.log('Defining requested presentation...');
        
        await axios.post(`${config.verifier_url}/define`, {
          verifier_url: config.verifier_url,
          definition_type: "exams",
        });
  
        setIsDefined(true);
  
        const qr_data = `walletapp://verify?uri=${config.verifier_url}&sp=Exams`;
        setQrData(qr_data);
        console.log(qr_data);
  
        console.log("Defined elements SP requested.");
      } catch (error) {
        setError("Error during initialization and definition");
        console.error(error);
      }
    };
  
    // Call the combined logic when the app loads
    initializeIssuerTrustAndDefinePresentation();
  }, []);

  const addStudent = () => {
    const id = prompt("Enter Student ID:");
    if (id) {
      setStudents([...students, { id, isValid: false }]); // Validation set to false for now
    }
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleValidation = (id) => {
    // Toggle validation state for the student
    setStudents(students.map(student =>
      student.id === id ? { ...student, isValid: !student.isValid } : student
    ));
  };

  const checkVerifications = async () => {
    try {
      const response = await axios.get(`${config.verifier_url}/v2/presentations`);
      const presentations = response.data;

      console.log('presentations', presentations)

      // Update students' validation status based on the presentations
      setStudents(students.map(student => {
        const presentation = presentations.find(p => p.credential.zID === student.id);
        return presentation ? { ...student, isValid: presentation.status === 'accepted' } : student;
      }));
    } catch (error) {
      console.error('Error fetching presentations:', error);
      setError("Error checking verifications");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!isDefined || !isInitialized) {
    return <div>Loading...</div>; // Loading state while the issuer trust is initialized and presentation is defined
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>UNSW Exam Management</h1>

        {/* QR Code Display in the Header */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '10px', backgroundColor: 'lightgray' }}>
            <h3>QR Code for Verification</h3>
            <QRCodeCanvas value={qrData} size={128} />
          </div>
        </div>
      </header>

      <button className="add-student-button" onClick={addStudent}>
        <strong>Add Student</strong>
      </button>

      <button className="check-verification-button" onClick={checkVerifications}>
        <strong>Check Verifications</strong>
      </button>

      <div className="student-list">
        {students.map((student, index) => (
          <div key={index} className="student-entry" 
            style={{
              border: `2px solid ${student.isValid ? 'green' : 'gray'}`,
              padding: '10px',
              margin: '10px',
              borderRadius: '5px',
              backgroundColor: student.isValid ? 'lightgreen' : 'lightgray',
            }}
          >
            <h3>Student ID: {student.id}</h3>
            <button className="delete-student-button" onClick={() => deleteStudent(student.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

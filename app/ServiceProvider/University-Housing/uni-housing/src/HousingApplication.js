import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid to generate unique IDs
import { QRCodeCanvas } from 'qrcode.react'; // Importing QRCodeCanvas component

const HousingApplication = () => {
  const [studentId, setStudentId] = useState('');
  const [sessionId, setSessionId] = useState(''); // To hold the session ID
  const [qrData, setQrData] = useState(''); // Data to be encoded in QR code

  // Effect to generate a session ID and QR code on component mount
  useEffect(() => {
    const generateSessionId = () => {
      const newSessionId = uuidv4(); // Generate a unique session ID
      setSessionId(newSessionId);
      setQrData(`Session ID: ${newSessionId}`); // Setting data for QR code
    };

    generateSessionId();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Logic for form submission can go here, e.g., save application data
    alert('Application Submitted!');
  };

  return (
    <div>
      {/* Header ribbon */}
      <div
        style={{
          backgroundColor: '#FFE600',
          padding: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <img src="/assets/unsw_logo.png" alt="Logo" style={{ height: '40px', marginLeft: '10px' }} />
        <h1 style={{ margin: '0 auto', textAlign: 'center' }}>University Housing Application</h1>
      </div>

      <div style={{ textAlign: 'center', padding: '16px' }}>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Student ID:
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </label>
          </div>

          {/* QR Code Generation */}
          {sessionId && (
            <div style={{ marginTop: '20px' }}>
              <h3>Please scan the QR code below to verify your student status.</h3>
              <QRCodeCanvas value={qrData} size={200} />
            </div>
          )}

          <button type="submit" style={{ marginTop: '20px' }}>Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default HousingApplication;

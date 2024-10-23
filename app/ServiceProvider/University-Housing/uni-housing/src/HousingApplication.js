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
    <div style={{ padding: '16px' }}>
      <h1>University Housing Application</h1>
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
            <h2>Your QR Code:</h2>
            <QRCodeCanvas value={qrData} size={200} />
          </div>
        )}

        <button type="submit" style={{ marginTop: '20px' }}>Submit Application</button>
      </form>
    </div>
  );
};

export default HousingApplication;

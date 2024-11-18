import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Importing QRCodeCanvas component
import config from './config.json';
import axios from 'axios';

const HousingApplication = () => {
  const [studentId, setStudentId] = useState('');
  const [qrData, setQrData] = useState(''); // Data to be encoded in QR code
  const [isDefined, setIsDefined] = useState(false);

  const [error, setError] = useState(null);

  // Effect to generate a session ID and QR code on component mount
  useEffect(() => {
    const defineRequestedPresentation = async () => {
      try {

        // Call the backend to initialize trust
        await axios.post(`${config.verifier_url}/define`, {
          verifier_url: config.verifier_url,
        });

        setIsDefined(true);

        const qr_data = `walletapp://verify?uri=${config.verifier_url}&sp=Housing`
        setQrData(qr_data);
        console.log(qrData)

        console.log("Defined elements SP requested.");
      } catch (error) {
        setError("Error during definition");
        console.error(error);
      }
    };

    // Call defineRequestedPresentation as the page loads
    defineRequestedPresentation();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!isDefined) {
    return <div>Loading...</div>; // You can display a loading indicator here
  }

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
          {(
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

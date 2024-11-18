import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Econ from './pages/Econ';
import Eng from './pages/Eng';
import ADA from './pages/ADA';
import Risk from './pages/Risk';
import Signup from './pages/Sign-up';
import { QRCodeCanvas } from 'qrcode.react'; // Importing QRCodeCanvas component
import axios from 'axios'
 
const IPconfig = require('./config.json')
// // Service Provider backend is listening on 8083
const verifier_url= JSON.stringify(IPconfig.verifier_url);
const issuer_url = JSON.stringify(IPconfig.issuer_url)
const IPaddress = JSON.stringify(IPconfig.IPaddress)
 
 
export function QR_BUTTON() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 
  const togglePopup = async () => {
    setIsPopupOpen(!isPopupOpen);
  };
    // Combine URL and JSON object as a string
  // Need to construct the data more carefully
 
  const QRCodeComponent = () => {
    const [studentId, setStudentId] = useState('');
    const [qrData, setQrData] = useState(''); // Data to be encoded in QR code
    const [isDefined, setIsDefined] = useState(false);
  
    const [error, setError] = useState(null);
 
    // Effect to generate a session ID and QR code on component mount
    useEffect(() => {
      const defineRequestedPresentation = async () => {
        try {
  
          // Call the backend to initialize trust
          await axios.post(`${IPconfig.verifier_url}/define`, {
            verifier_url: IPconfig.verifier_url,
            definition_type: "employer"
          });
  
          setIsDefined(true);
  
          const qr_data = `walletapp://verify?uri=${IPconfig.verifier_url}&sp=Employerx`
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
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Please scan the QR code below to verify your student status.</h2>
        <div style={{ marginTop: '20px' }}>
              <QRCodeCanvas value={qrData} size={200} />
            </div>
      </div>
    );
  };
 
  return (
    <div>
    <button className="qr-code-button" onClick={togglePopup}>
      <strong>
        Apply Now
      </strong>
    </button>
      {isPopupOpen && (
        <div className="qr-popup">
          <div className="qr-popup-content">
            <span className="close" onClick={togglePopup}>&times;</span>
            <QRCodeComponent/>
          </div>
        </div>
      )}
    </div>
  );
}
 
export function JOB_BUTTON({ text, url }) {
  const openInNewTab = () => {
    window.open(url, "_blank", "noreferrer");
  };
  return (
    <button className='job-button' onClick={openInNewTab}>
      { text }
    </button>
  );
}
function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const initializeIssuerTrust = async () => {
      try {
        const issuer_get = await fetch("http://localhost:8082", {
          method: 'GET',
        });
        
        if (!issuer_get.ok) {
          throw new Error('Failed to fetch DID');
        }
        
        const issuerData = await issuer_get.json();
        console.log("issuer_did", issuerData.did_uri);
 
        const issuer_did = await issuerData.did_uri;
 
        const verifier_url = IPconfig.verifier_url;
 
        // Call the backend to initialize trust
        await axios.post(`http://localhost:8083/initialize`, {
          issuer_did,
          verifier_url,
        });
 
        setIsInitialized(true);
        console.log("Issuer trusted successfully");
      } catch (error) {
        setError("Error during initialization");
        console.error(error);
      }
    };
 
    // Call initializeIssuerTrust when the app loads
    initializeIssuerTrust();
  }, []);
 
  if (error) {
    return <div>{error}</div>;
  }
 
  if (!isInitialized) {
    return <div>Loading...</div>; // You can display a loading indicator here
  }
  return (
    <div className='App'>
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>Jobs@UNSW</h1>
      </header>
      <br/><br/>
      <Router>
      <div className='button-container'>
        <JOB_BUTTON text="Casual Academic Talent Pool - Engineering - Computer Science & Engineering" url="/Eng"></JOB_BUTTON>        
        <JOB_BUTTON text="Casual Academic Talent Pool - Business - Economics" url="/Econ"></JOB_BUTTON>
        <JOB_BUTTON text="Casual Academic Talent Pool - Business - Risk and Actuarial" url="Risk"></JOB_BUTTON>
        <JOB_BUTTON text="Casual Academic Talent Pool - ADA - Humanities and Literature" url="ADA"></JOB_BUTTON>
      </div>
        <Routes>
          <Route path="/Eng" element={<Eng/>} />
          <Route path="/Econ" element={<Econ/>} />
          <Route path="/ADA" element={<ADA/>} />
          <Route path="/Risk" element={<Risk />} />
          <Route path="/signuppage" element={<Signup />} />
        </Routes>
      </Router>
      <footer className='App-footer'>
        <p className='footer-notes'>
          <strong>UNSW Employability</strong>
        </p>
      </footer>
    </div>
  );
}
 
export default App;
 
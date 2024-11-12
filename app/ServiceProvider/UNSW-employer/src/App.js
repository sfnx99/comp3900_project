import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Econ from './pages/Econ';
import Eng from './pages/Eng';
import ADA from './pages/ADA';
import Risk from './pages/Risk';
import Signup from './pages/Sign-up';
import {QRCodeSVG} from 'qrcode.react';

const IPconfig = require('./config.json')
// // Service Provider backend is listening on 8083
// let endpoint= JSON.stringify(IPconfig.credential_endpoint);
const verifier_url= JSON.stringify(IPconfig.verifier_url);
const issuer_url = JSON.stringify(IPconfig.issuer_url)

// Sets up service provider definition
const setup = async () => {
  const res= await fetch(issuer_url);
  // const issuer_did = res.data.did_uri;
  const data = await res.json()
  const issuer_did = data.did_uri;
  
  await fetch(`${verifier_url}/v2/trust`, {
    method: "POST",
    body: JSON.stringify({
      id: issuer_did,
    }),
  });

  await fetch(`${verifier_url}/v2/definition`, {
    method: "POST",
    body: JSON.stringify({
      type: "UNSWCredential",
      requiredAttributes: ["zID", "expiryDate"],
    }),
  });
}


export function QR_BUTTON() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = async () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const QRCodeComponent = () => {
  
    // Combine URL and JSON object as a string
    // Need to construct the data more carefully
    const [qrCodeValue, setQrCodeValue] = useState('');
    const qrCodeData = { 
      // fetch
      verifier_url: "http://localhost:8083",
      request: 'True'
    }; 
    setQrCodeValue(JSON.stringify(qrCodeData));
    // const combinedData = `${endpoint}`;
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Scan to sign in</h2>
        <QRCodeSVG 
          value={qrCodeValue}
          size={256} 
          bgColor={"#ffffff"} 
          fgColor={"#000000"} 
          level={"L"} 
        />
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
  setup()
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


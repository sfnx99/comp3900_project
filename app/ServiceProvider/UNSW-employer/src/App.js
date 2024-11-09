import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Econ from './pages/Econ';
import Eng from './pages/Eng';
import ADA from './pages/ADA';
import Risk from './pages/Risk';
import Signup from './pages/Sign-up';
import {QRCodeSVG} from 'qrcode.react';
import axios from 'axios'

const IPconfig = require('./config.json')
// // Service Provider backend is listening on 8083
const url= JSON.stringify(IPconfig.credential_endpoint);
const verifier_url = "http://localhost:8083"
const issuer_url = "http://localhost:8082"
const wallet_url = "http://localhost:8081"

const res = await axios.get(issuer_url)
const issuer_did = res.data.did_uri;
await axios.post(verifier_url + "/v2/trust", {
  "id": issuer_did
});
await axios.post(verifier_url + '/v2/definition', {
  type: "UNSWCredential",
  requiredAttributes: ["zID", "expiryDate"]
});

const request = async () => {
  try {
    const response = await fetch(`${verifier_url}/v2/request`, {
    });    
    if (!response.ok) {
      throw Error
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching credential:', error);
    throw error;
  }
}


export function QR_BUTTON() {
  const [preso, setPreso] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = async () => {
    setIsPopupOpen(!isPopupOpen);
    let data = await request()
    setPreso(data)
  };

  const QRCodeComponent = async (preso) => {
  
    // Combine URL and JSON object as a string
    const combinedData = `${url}\n${JSON.stringify(preso)}`;
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>QR Code with URL and JSON Data</h2>
        <QRCodeSVG 
          value={combinedData} 
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
            <QRCodeComponent value= {preso}/>
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


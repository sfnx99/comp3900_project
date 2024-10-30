import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Econ from './pages/Econ';
import Eng from './pages/Eng';
import ADA from './pages/ADA';
import Risk from './pages/Risk';
import Signup from './pages/Sign-up';
import {QRCodeSVG} from 'qrcode.react';
// import {getLocalIPAddress} from './Helper'

export function QR_BUTTON() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // const localIP = getLocalIPAddress();
  const localIP="http://192.168.0.105"
  const url = localIP.concat(":8081/access");
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
             <QRCodeSVG value={url}/>
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


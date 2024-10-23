import React, { useState } from 'react';
import './App.css';

function QR_BUTTON() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
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
            <h2>Your QR Code</h2>
          </div>
        </div>
      )}
    </div>
  );
}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>Jobs@UNSW</h1>
      </header>
      <div className="job-description">
        <h1>Casual Academic Talent Pool - Engineering - Computer Science & Engineering</h1>
        <p>
          <strong>Job no: </strong>504543 <br/>
          <strong>Work type: </strong>casual <br/>
          <strong>Location: </strong>Sydney, NSW <br/>
          <strong>Categories: </strong>Tutor, Lecturer, Other, Demonstrator <br/>
        </p>
      </div>
      <div className="qr-button">
        <QR_BUTTON></QR_BUTTON>
      </div>
    </div>
  );
}

export default App;


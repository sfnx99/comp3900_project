import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import HousingApplication from './HousingApplication';
import axios from 'axios';
import config from './config.json';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeIssuerTrust = async () => {
      try {
        const issuer_did = config.issuer_did;
        const verifier_url = config.verifier_url;

        // Call the backend to initialize trust
        await axios.post(`${verifier_url}/initialize`, {
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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<HousingApplication />} />
      </Routes>
    </Router>
  );
}

export default App;

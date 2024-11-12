import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddCredentialPage from './pages/AddCredentialPage';
import ListCredentialPage from './pages/ListCredentialPage';
import ViewCredentialPage from './pages/ViewCredentialPage';
import VerifyCredentialsPage from './pages/VerifyCredentialsPage';
import RevokeCredentialsPage from './pages/RevokeCredentialPage';
import NotificationPage from './pages/NotificationPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NavigationBar from './components/NavigationBar';
import MobileNavigationBar from './components/MobileNavigationBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import IssueCredentialsPage from './pages/IssueCredentialsPage';
import AuthorizeCredentialPage from './pages/AuthorizeCredentialPage';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showNavigationBar = location.pathname !== '/login' && location.pathname !== '/register';
  const showFooter = location.pathname !== '/login' && location.pathname !== '/register';

  const getToken = () => {
    return localStorage.getItem('token');
  };

  return (
    <div className="App">
      {showNavigationBar && (isMobile ? <MobileNavigationBar /> : <NavigationBar />)}
      <div className="mainContent">
        <Routes>
          <Route path="/" element={getToken() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/credential/add" element={<ProtectedRoute><AddCredentialPage /></ProtectedRoute>} />
          <Route path="/credentials/list" element={<ProtectedRoute><ListCredentialPage /></ProtectedRoute>} />
          <Route path="/credential/unswcredential" element={<ProtectedRoute><ViewCredentialPage /></ProtectedRoute>} />
          <Route path="/revoke-credentials" element={<ProtectedRoute><RevokeCredentialsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          {/* <Route path="/issue-credentials" element={<ProtectedRoute><IssueCredentialsPage /></ProtectedRoute>} /> */}
          {/* <Route path="/credential/authorize/:id" element={<AuthorizeCredentialPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
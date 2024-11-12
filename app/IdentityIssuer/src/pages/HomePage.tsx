import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaPlusCircle, FaEye, FaTimesCircle, FaUserCog, FaIdCard, FaRegUserCircle } from 'react-icons/fa'; 
import { MdOutlineAddCard, MdCreditCardOff } from 'react-icons/md'; 

function HomePage() {
  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <h2 style={styles.subHeader}>Nucleus Hub Services</h2>
        <div style={styles.servicesGrid}>
          <Link to="/credential/add" style={styles.serviceBox}>
            <MdOutlineAddCard style={styles.icon} />
            <span style={styles.linkText}>Add Credential</span>
          </Link>
          <Link to="/credential/unswcredential" style={styles.serviceBox}>
            <FaIdCard style={styles.icon} />
            <span style={styles.linkText}>View Credential</span>
          </Link>
          <Link to="/credential/add" style={styles.serviceBox}>
            <MdCreditCardOff style={styles.icon} />
            <span style={styles.linkText}>Issue Credential</span>
          </Link>
          <Link to="/revoke-credentials" style={styles.serviceBox}>
            <FaRegUserCircle style={styles.icon} />
            <span style={styles.linkText}>Revoke Credential</span>
          </Link>
        </div>
      </div>
      <div style={styles.rightContainer}>
        <h1 style={styles.header}>Welcome to Nucleus Hub Admin Portal</h1>
        <p style={styles.paragraph}>
          Nucleus Hub is your trusted platform for managing and issuing digital credentials for university students at UNSW. 
          Our secure and user-friendly system ensures that verification is easier and safer, making the student administration process seamless.
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    margin: '0px 100px',
    minHeight: '70vh',
  },
  leftContainer: {
    flex: 1,
    paddingRight: '20px',
    borderRight: '1px solid #ccc',
  },
  rightContainer: {
    flex: 2,
    paddingLeft: '20px',
  },
  header: {
    fontSize: '1.25em',
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: '10px', 
  },
  paragraph: {
    fontSize: '0.6em', 
    color: '#333',
    textAlign: 'center',
    marginBottom: '10px',
  },
  subHeader: {
    fontSize: '1em', 
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: '10px', 
  },
  featuresContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px', 
  },
  feature: {
    backgroundColor: '#fff',
    padding: '10px', 
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '1em', 
    color: '#007bff',
    marginBottom: '5px', 
  },
  featureText: {
    fontSize: '0.6em', 
    color: '#333',
    marginBottom: '5px', 
  },
  link: {
    fontSize: '0.6em', 
    color: '#007bff',
    textDecoration: 'none',
  },
  linkText: {
    fontSize: '0.6em', 
    color: '#007bff',
    textDecoration: 'none',
  },
  getStartedContainer: {
    marginTop: '20px',
  },
  processContainer: {
    marginTop: '20px', 
  },
  servicesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  serviceBox: {
    flex: '40%', 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#daedf6',
    borderRadius: '8px',
  },
};

export default HomePage;
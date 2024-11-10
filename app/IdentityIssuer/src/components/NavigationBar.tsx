import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.jpeg';

const NavigationBar = () => {
  return (
    <div>
      <div style={styles.headerContainer}>
        <Link to="/home"><img src={logo} alt="Nucleus Hub Logo" style={styles.logo} /></Link>
        <div>
        <h1 style={styles.headerText}>Nucleus Hub</h1>
        <p style={styles.headerParaText}>Helping Students Navigate University</p>
        </div>
        
      </div>
      <div style={styles.container}>
      <ul style={styles.navList}>
          <div style={styles.navItemsContainer}>
            <Link to="/home" style={styles.navItem}><span style={styles.link}>Home</span></Link>
            <Link to="/credential/add" style={styles.navItem}><span style={styles.link}>Add Credential</span></Link>
            <Link to="/credentials/list" style={styles.navItem}><span style={styles.link}>View Credentials</span></Link>
            <Link to="/notifications" style={styles.navItem}><span style={styles.link}>Notifications</span></Link>
            <Link to="/profile" style={styles.navItem}><span style={styles.link}>Admin Settings</span></Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: 'white',
    borderBottom: '10px solid #ffca0e',
  },
  logo: {
    height: '100px',
    margin: '0px 100px',
  },
  headerText: {
    fontSize: '1.5em',
    color: 'black',
    margin: '0px 100px',
  },

  headerParaText: {
    fontSize: '0.7em',
    color: 'black',
    margin: '0px 100px',
  },
  container: {
    background: 'linear-gradient(to top, black, #787473)', 
    color: 'white',
    margin: '0px 100px',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    listStyleType: 'none',
    padding: '10px 20px',
    margin: 0,
  },
  navItemsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  navItem: {
    margin: '0 10px',
    padding: '5px 10px', 
    hover: 'blue'
  },
  link: {
    color: 'white', 
    textDecoration: 'none',
    display: 'flex',
    fontSize: '13px',
  },
  notificationIcon: {
    marginRight: '5px',
  },
  profileIcon: {
    marginRight: '5px',
  },
};

export default NavigationBar;
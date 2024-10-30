import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaIdCard, FaRegUserCircle } from "react-icons/fa";
import { MdOutlineAddCard, MdCreditCardOff } from "react-icons/md";

const MobileNavigationBar = () => {
  return (
    <div>
      <header style={styles.header}>
        Student Credential Services
      </header>
      <div style={styles.container}>
        <ul style={styles.navList}>
          <li style={styles.navItem}><Link to="/credential/add"><MdOutlineAddCard style={styles.icon} /></Link></li>
          <li style={styles.navItem}><Link to="/credentials/list"><FaIdCard style={styles.icon} /></Link></li>
          <li style={styles.navItem}><Link to="/credentials/revoke"><MdCreditCardOff style={styles.icon} /></Link></li>
          <li style={styles.navItem}><Link to="/profile"><FaRegUserCircle style={styles.icon} /></Link></li>
        </ul>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  header: {
    width: '100%',
    padding: '10px 0',
    textAlign: 'center',
    backgroundColor: '#001f3f',
    color: 'white',
    fontSize: '20px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    boxSizing: 'border-box', 
  },
  container: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#001f3f', 
    zIndex: 1000,
    padding: '15px 0', 
    boxSizing: 'border-box',
  },
  navList: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    listStyleType: 'none',
    padding: '10px 0',
    margin: 0,
    color: 'white',
    width: '100%',
    boxSizing: 'border-box', 
  },
  navItem: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    width: '30px',
    height: '30px',
    color: 'white',
  },
};

export default MobileNavigationBar;
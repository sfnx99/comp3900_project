import React, { useState, CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, registerOwner } from '../scripts/api'; 

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
<<<<<<< HEAD
      const res = await fetch("http://localhost:8082/v2/register", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // Ensure the content type is JSON
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      });
=======
      const data = await registerOwner(email, password);
      alert('Registration successful! Please check your email to complete account setup.');
>>>>>>> main
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.logo}>
        <img src="/unsw.png" alt="NSW Government Logo" style={styles.logoImage} />
      </div>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Register with NSW Government</h2>
        <div style={styles.inputContainer}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={styles.input}
            required
          />
        </div>
        <button onClick={handleRegister} style={styles.button}>Register</button>
        <p style={styles.registerText}>
          Don't have an account? <Link to="/login" style={styles.registerLink}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  logo: {
    marginBottom: '20px',
  },
  logoImage: {
    width: '150px',
    height: 'auto',
  },
  formContainer: {
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '1.25em',
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: '20px',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '0.9em',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '0.9em',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#001f3f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  registerText: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '0.9em',
    color: '#333',
  },
  registerLink: {
    color: '#001f3f',
    textDecoration: 'none',
  },
};

export default RegisterPage;

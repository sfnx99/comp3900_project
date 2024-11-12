import React, { useState, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUNSWCredentialFormat, setIssuer, sendInfo, issueCredToClient, saveAuthCode } from '../scripts/api'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
const wallet_url = "http://localhost:8081";

function AddCredentialPage() {
  const [fields, setFields] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    USI: '',
    expiryDate: '',
    zID: ''
  });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFields(prevFields => ({
      ...prevFields,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const dataToSubmit = {
      client_id: fields.email,
      firstName: fields.firstName,
      lastName: fields.lastName,
      dob: fields.dob,
      USI: fields.USI,
      expiryDate: fields.expiryDate,
      zID: fields.zID
    };

    try {
      await setIssuer('UNSW');
      await setUNSWCredentialFormat();
      await sendInfo(dataToSubmit.client_id, dataToSubmit);
      const response = await issueCredToClient(dataToSubmit.client_id, 'wahoo', wallet_url, 'xyz', 'UNSWCredential');
      const auth_code = response.code;
      console.log('Authorization successful, auth code:', auth_code);
      await saveAuthCode(auth_code);
      console.log('Submitted field values:', dataToSubmit);

      toast.info('Request has been sent. Once accepted, it will appear in the notification tab.');

      setTimeout(() => {
        toast.success('Credential added successfully. Check the notification tab for more details.');
        navigate('/credential/unswcredential'); 
      }, 5000); 
    } catch (error) {
      console.error('Error submitting field values:', error);
      toast.error('Error submitting credential.');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Add Credential</h1>
      <p style={styles.paragraph}>
        Use this form to add a new credential. Fill in the required fields and specify the expiry date.
      </p>
      {(Object.keys(fields) as Array<keyof typeof fields>).map((field, index) => (
        <div key={index} style={styles.fieldContainer}>
          <input
            type="text"
            name={field}
            value={fields[field]}
            onChange={handleChange}
            placeholder={field}
            style={styles.input}
          />
        </div>
      ))}
      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit} style={styles.button}>Submit</button>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    margin: '0 100px',
    padding: '20px 400px', 
    lineHeight: '1.6',
    backgroundColor: '#f9f9f9',
    minHeight: '70vh',
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
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px', 
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '0.6em', 
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box', 
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  button: {
    padding: '5px 10px', 
    fontSize: '0.6em', 
    color: '#fff',
    backgroundColor: '#001f3f', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AddCredentialPage;
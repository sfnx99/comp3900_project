import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCredential } from '../scripts/api'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function AddCredentialPage() {
  const [fields, setFields] = useState([{ value: '' }]);
  const [validityPeriod, setValidityPeriod] = useState(''); 
  const navigate = useNavigate();

  const handleAddField = () => {
    setFields([...fields, { value: '' }]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, value: event.target.value };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleValidityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (parseInt(value, 10) >= 0 || value === '') {
      setValidityPeriod(value);
    }
  };

  const handleSubmit = async () => {
    const fieldValues = fields.map((field, index) => ({
      name: index === 0 ? 'Name of Credential' : `Field ${index}`,
      value: field.value,
    }));

    const hasEmptyField = fields.some(field => field.value.trim() === '');
    if (hasEmptyField || validityPeriod.trim() === '') {
      alert('Please fill in all fields before submitting or remove empty fields');
      return;
    }

    const dataToSubmit = {
      fields: fieldValues,
      validityPeriod: validityPeriod,
    };

    try {
      const data = await addCredential(dataToSubmit);
      console.log('Submitted field values:', fieldValues);
      console.log('Token', data.token);
      toast.info('Request has been sent. Once accepted, it will appear in the notification tab.');

      const nameField = fieldValues.find(field => field.name === 'Name of Credential');
      const notification = {
        id: data.id,
        message: `The credential "${nameField?.value}" has been approved by the NSW Government. Now you can manage this credential in View Credentials.`,
        timestamp: new Date(),
      };
      console.log("Added notification:", notification);

      setTimeout(() => {
        toast.success('Credential added successfully. Check the notification tab for more details.');
      }, 5000); 
    }
    
    catch (error) {
      console.error('Error submitting field values:', error);
      toast.error('Error submitting credential.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleAddField();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fields]);

  return (
    <div style={styles.container}>
      <ToastContainer />
      <h1 style={styles.header}>Add Credential</h1>
      <p style={styles.paragraph}>
        Use this form to add a new credential. Fill in the required fields and specify the validity period.
      </p>
      {fields.map((field, index) => (
        <div key={index} style={styles.fieldContainer}>
          <input
            type="text"
            value={field.value}
            onChange={(event) => handleChange(index, event)}
            placeholder={index === 0 ? 'Name of Credential' : `Field ${index}`}
            style={styles.input}
          />
          {index !== 0 && (
            <button onClick={() => handleRemoveField(index)} style={styles.removeButton}>Remove</button>
          )}
        </div>
      ))}
      <div style={styles.fieldContainer}>
        <input
          type="number"
          value={validityPeriod}
          onChange={handleValidityChange}
          placeholder="How long should the credential be valid (in months)"
          style={styles.input}
          min="0" 
        />
      </div>
      <div style={styles.buttonContainer}>
        <button onClick={handleAddField} style={styles.button}>Add Field</button>
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
  removeButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    fontSize: '0.6em', 
    color: '#fff',
    backgroundColor: '#cd4212',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
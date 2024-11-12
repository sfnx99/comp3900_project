import React, { useState, CSSProperties } from 'react';

interface InfoPopupProps {
  onClose: () => void;
  onSubmit: (info: any) => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ onClose, onSubmit }) => {
  const [info, setInfo] = useState({
    clientId: '',
    firstName: '',
    lastName: '',
    zID: '',
    dob: '',
    USI: '',
    faculty: '',
    expiryDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(info);
    onClose();
  };

  return (
    <div style={styles.popup}>
      <div style={styles.popupInner}>
        <h2>Enter Information</h2>
        {Object.keys(info).map((key) => (
          <div key={key} style={styles.field}>
            <label>{key}</label>
            <input
              type="text"
              name={key}
              value={(info as any)[key]}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        ))}
        <button onClick={handleSubmit} style={styles.button}>Generate QR Code</button>
        <button onClick={onClose} style={styles.button}>Close</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  popup: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupInner: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
  },
  field: {
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    boxSizing: 'border-box',
  },
  button: {
    padding: '10px',
    margin: '5px',
    fontSize: '0.8em',
    cursor: 'pointer',
  },
};

export default InfoPopup;
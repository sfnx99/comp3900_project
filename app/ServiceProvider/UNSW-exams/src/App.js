import React, { useState } from 'react';
import './App.css';

function QRCodePopup({ id, onClose, onValidate }) {
  return (
    <div className="qr-popup">
      <div className="qr-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>QR Code for Student ID: {id}</h2>
        <div className="dummy-qr-code">
          <p>Dummy QR Code</p>
        </div>
        <button className="valid-button" onClick={() => onValidate(id, true)}>Valid</button>
        <button className="invalid-button" onClick={() => onValidate(id, false)}>Invalid</button>
      </div>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const addStudent = () => {
    const id = prompt("Enter Student ID:");
    if (id) {
      setStudents([...students, { id, isValid: false }]);
    }
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const openPopup = (id) => {
    setCurrentId(id);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentId(null);
  };

  const handleValidation = (id, isValid) => {
    setStudents(students.map(student =>
      student.id === id ? { ...student, isValid } : student
    ));
    closePopup();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>UNSW Exam Management</h1>
      </header>

      <button className="add-student-button" onClick={addStudent}>
        <strong>Add Student</strong>
      </button>

      <div className="student-list">
        {students.map((student, index) => (
          <div key={index} className="student-entry">
            <button
              className={`student-id-button ${student.isValid ? 'valid' : 'invalid'}`}
              onClick={() => openPopup(student.id)}
            >
              {student.id}
            </button>
            <button className="delete-student-button" onClick={() => deleteStudent(student.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <QRCodePopup id={currentId} onClose={closePopup} onValidate={handleValidation} />
      )}
    </div>
  );
}

export default App;

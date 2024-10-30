import React, { useState, useEffect } from 'react';
import './App.css';

function QRCodePopup({ id, onClose, onValidate }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onValidate(id, true); // Automatically validates to "Valid" after 5 seconds
      onClose();
    }, 5000);

    return () => clearTimeout(timer); // Clear timer if popup closes before time
  }, [id, onClose, onValidate]);

  return (
    <div className="qr-popup">
      <div className="qr-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>QR Code for Student ID: {id}</h2>
        <div className="qr-code">
          <img src="/qr_code.png" alt="QR Code" width="128" height="128" />
        </div>
      </div>
    </div>
  );
}

function StudentListPopup({ students, onClose, title }) {
  return (
    <div className="student-list-popup">
      <div className="student-list-popup-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        <ul>
          {students.length > 0 ? (
            students.map((student, index) => <li key={index}>{student.id}</li>)
          ) : (
            <p>No students found</p>
          )}
        </ul>
      </div>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [showValidStudents, setShowValidStudents] = useState(false);
  const [showInvalidStudents, setShowInvalidStudents] = useState(false);

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
  };

  const toggleValidStudentsPopup = () => {
    setShowValidStudents(!showValidStudents);
  };

  const toggleInvalidStudentsPopup = () => {
    setShowInvalidStudents(!showInvalidStudents);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>UNSW Exam Management</h1>
        <div className="student-buttons">
          <button onClick={toggleValidStudentsPopup}>Show Validated Students</button>
          <button onClick={toggleInvalidStudentsPopup}>Show Unvalidated Students</button>
        </div>
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

      {showValidStudents && (
        <StudentListPopup
          students={students.filter(student => student.isValid)}
          onClose={toggleValidStudentsPopup}
          title="Validated Students"
        />
      )}

      {showInvalidStudents && (
        <StudentListPopup
          students={students.filter(student => !student.isValid)}
          onClose={toggleInvalidStudentsPopup}
          title="Unvalidated Students"
        />
      )}
    </div>
  );
}

export default App;

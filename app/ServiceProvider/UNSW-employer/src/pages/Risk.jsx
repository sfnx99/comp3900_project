import React from 'react';
import {QR_BUTTON} from '../App.js'
import '../App.css';
import img from "../images/business.png"
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function Risk() {
  return (
<div className="App">
      <div className="job-description">
        <h1>Casual Academic Talent Pool - Business - Risk and Actuarial</h1>
        <p>
          <strong>Job no: </strong>504545 <br/>
          <strong>Work type: </strong>casual <br/>
          <strong>Location: </strong>Sydney, NSW <br/>
          <strong>Categories: </strong>Tutor, Lecturer, Other, Demonstrator <br/>
          <br/>
          <strong>The School of Risk and Actuarial Studies is seeking applications for casual opportunities in 2025 courses.</strong>

          The positions are only available to those who are eligible to work in Australia, 
          those who are able to demonstrate understanding of the content for the courses they wish to work in.
          <br/><br/>
          Tutors are expected to teach tutorials in undergraduate and/or postgraduate 
          actuarial programs, provide consultations to students, answer students’ 
          questions in discussion forums, mark assessment items, complete the UNSW 
          Business School Tutor Training, attend meetings as required, and in 
          some cases, provide in-class support to lecturers.
        </p>
      </div>
      <div className="qr-button">
        <QR_BUTTON></QR_BUTTON>
      </div>
      <img src={img} alt='Engineering in action' className='job-image'/>
    </div>
  );
}

export default Risk;  
  
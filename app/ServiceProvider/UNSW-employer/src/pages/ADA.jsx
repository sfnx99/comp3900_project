import React from 'react';
import {QR_BUTTON} from '../App.js'
import '../App.css';
import img from "../images/humanities.png"
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function ADA() {
  return (
<div className="App">
      <div className="job-description">
        <h1>Casual Academic Talent Pool - ADA - Humanities and Literature</h1>
        <p>
          <strong>Job no: </strong>504546 <br/>
          <strong>Work type: </strong>casual <br/>
          <strong>Location: </strong>Sydney, NSW <br/>
          <strong>Categories: </strong>Tutor, Lecturer, Other, Demonstrator <br/>
          <br/>
          <strong>The School of Humanities and Languages in the Faculty of Arts, Design and Architecture is seeking expressions of interest from qualified individuals for teaching opportunities in 2024. We encourage experienced tutors, lecturers, recent graduates and HDR candidates to register their interest in working with the School.</strong>
          <br/><br/>
          Our School teaches across the below disciplines:
          <br/><br/>
          - Philosophy <br/>
          - History and Area Studies <br/>
          - Gender Studies <br/>
          - European Culture and Languages (German, French, Spanish, Greek) <br/>
          - Chinese Culture and Language <br/>
          - Japanese and Korean Culture and Language <br/>
          - Linguistics <br/>
          - Translation and Interpreting <br/>
          - Environmental Humanities <br/>
          - Environmental Management <br/>
          <br/>
          The Academic talent pool registration will allow you to select your 
          area of interest, which courses you would be interested in teaching 
          as well as providing information on your qualifications and experience 
          to assess your suitability for any roles. When opportunities arise, you 
          will be contacted for an interview to discuss your experience, skills 
          and qualifications.
        </p>
      </div>
      <div className="qr-button">
        <QR_BUTTON></QR_BUTTON>
      </div>
      <img src={img} alt='Engineering in action' className='job-image'/>
    </div>
  );
}

export default ADA;  
  
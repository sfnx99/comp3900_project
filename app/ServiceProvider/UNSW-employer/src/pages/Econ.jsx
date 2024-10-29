import React from 'react';
import {QR_BUTTON} from '../App.js'
import '../App.css';
import img from "../images/business.png"
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function Econ() {
  return (
<div className="App">
      <div className="job-description">
        <h1>Casual Academic Talent Pool - Business - Economics</h1>
        <p>
          <strong>Job no: </strong>504544 <br/>
          <strong>Work type: </strong>casual <br/>
          <strong>Location: </strong>Sydney, NSW <br/>
          <strong>Categories: </strong>Tutor, Lecturer, Other, Demonstrator <br/>
          <br/>
          <strong>The School of Economics is seeking applications for casual opportunities in 2025 courses.</strong>

          The positions are only available to those who are eligible to work in Australia,
          those who have studied upper-level Economics courses and are able to 
          demonstrate understanding of the content for the courses they wish to 
          work in, and those who hold a qualification at least one level higher 
          than that held by the students enrolled in the course/qualification in 
          which they are teaching.
          <br/><br/>
          We expect to offer majority on-campus activities in 2025 for undergraduate 
          courses, and both on-campus and online activities for postgraduate courses. 
          In addition to tutor-type roles, there may also be some opportunities in 
          online support (e.g., monitoring Moodle forums); marking (online or 
          otherwise); and in some cases online consultation and the production of 
          online resources.
        </p>
      </div>
      <div className="qr-button">
        <QR_BUTTON></QR_BUTTON>
      </div>
      <img src={img} alt='Engineering in action' className='job-image'/>
    </div>
  );
}

export default Econ;  
  
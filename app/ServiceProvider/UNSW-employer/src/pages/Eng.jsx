import React from 'react';
import {QR_BUTTON} from '../App.js'
import '../App.css';
import img from "../images/eng.png"
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


function Eng() {
  return (
    <div className="App">
      <div className="job-description">
        <h1>Casual Academic Talent Pool - Engineering - Computer Science & Engineering</h1>
        <p>
          <strong>Job no: </strong>504543 <br/>
          <strong>Work type: </strong>casual <br/>
          <strong>Location: </strong>Sydney, NSW <br/>
          <strong>Categories: </strong>Tutor, Lecturer, Other, Demonstrator <br/>
          <br/>
          The School of Computer Science and Engineering is one of the largest and 
          most prestigious schools of computing in Australia. It offers undergraduate 
          programmes in Software Engineering, Computer Engineering, Computer Science, 
          and Bioinformatics, as well as a number of combined degrees with other disciplines. 
          Our research and teaching staff are world leading and world building as 
          they advance knowledge and learning. <br/><br/>
          The School has positions available for casual academics for lectures, 
          tutorials, demonstrating, marking assessments and providing academic 
          administrative support for courses in computer science and engineering.
        </p>        

      </div>
      <div className="qr-button">
        <QR_BUTTON></QR_BUTTON>
      </div>
      <div>
        <img src={img} alt='Engineering in action' className='job-image'/>
      </div>
    </div>
  );
}

export default Eng;  
  
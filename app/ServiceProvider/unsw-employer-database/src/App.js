import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
const verifier_url = "http://localhost:8083"
const issuer_url = "http://localhost:8082"
const wallet_url = "http://localhost:8081"

const getPresentations = async () => {
  try {
    const response = await fetch(`${verifier_url}/v2/presentations`, {
    });    
    if (!response.ok) {
      throw Error
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error fetching credential:', error);
    throw error;
  }
}

const VariableSizeList = () => {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState("");
  setList(getPresentations)
  return (
    <div className="App">
      <header className="App-header">
        <img src="https://www.jobs.unsw.edu.au/jobs_files/logo.svg" alt="Site Logo" className="site-logo" />
        <h1>Jobs@UNSW</h1>
      </header>
      <div className="container">
        <h2 className="title">Applications for School of Engineering Casual Academic Talent Pool</h2>
        <ul className="list">
          {list.map((item, index) => (
            <li key={index} className="list-item">
              <button className="Application-item">{item}</button>
            </li>
          ))}
        </ul>
        <button onClick={fetch_items} className="add-button">
          Refresh
        </button>
      </div>
    </div>
  );
};

export default VariableSizeList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const VariableSizeList = () => {
  const [list, setList] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4999/items")
      .then((response) => setList(response.data.items))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const addItem = () => {
    if (newItem.trim()) {
      axios.post("http://localhost:4999/items", { newItem })
        .then((response) => {
          setList(response.data.items);
          setNewItem("");
        })
        .catch((error) => console.error("Error adding item:", error));
    }
  };

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
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Enter a new item"
          className="input"
        />
        <button onClick={addItem} className="add-button">
          Add Item
        </button>
      </div>
    </div>
  );
};

export default VariableSizeList;

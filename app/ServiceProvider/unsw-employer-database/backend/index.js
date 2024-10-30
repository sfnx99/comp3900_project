const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4999;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory list storage
let items = [];

// Endpoint to get all items
app.get("/items", (req, res) => {
  res.json({ items });
});

// Endpoint to add a new item
app.post("/items", (req, res) => {
  const { newItem } = req.body;
  if (newItem) {
    items.push(newItem);
    res.status(201).json({ message: "Item added", items });
  } else {
    res.status(400).json({ message: "Invalid item" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Credential, Notification } = require('../models'); // Import Mongoose models

const router = express.Router();

const users = [
  { email: 'unsw@edu.au', password: 'unsw123' }
];

const JWT_SECRET = 'your_jwt_secret_key';

// Email transporter setup (using a mock service like Ethereal for testing)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: 'tressie.bruen23@ethereal.email',
    pass: 'YnrVJS7UZfPX6auTsC'
  }
});

async function sendEmail(email, subject, text, html) {
  const mailOptions = {
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  users.push({ email, password });

  console.log("Created:", { email, password });

  const subject = 'Complete Your Account Setup';
  const text = `Please click the following link to complete your account setup: http://localhost:3000/complete-setup?email=${encodeURIComponent(email)}`;
  const html = `<b>Please click the following link to complete your account setup:</b> <a href="http://localhost:3000/complete-setup?email=${encodeURIComponent(email)}">Complete Setup</a>`;

  try {
    await sendEmail(email, subject, text, html);
    res.status(200).json({ message: 'Registration successful. Please check your email to complete account setup.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email. Please try again later.' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);
  if (user) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    console.log("User logged in:", { email, password });
    console.log("Generated token:", token); 
    res.status(200).json({ message: 'Login successful', token: token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});

router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({});
    console.log("Returning notifications:", notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = { router, authenticateToken };
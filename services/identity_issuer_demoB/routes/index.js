const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const router = express.Router();
const app = express();
const port = process.env.PORT || 8082;

app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_jwt_secret_key';

// Mock user database
const users = [
    { email: 'nucleushub@edu.au', password: '123' }
];

let credentialsStore = [];
let notificationsStore = [];

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: 'tressie.bruen23@ethereal.email',
        pass: 'YnrVJS7UZfPX6auTsC'
    }
});

// Function to send email
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

router.post('/auth/register', async (req, res) => {
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

router.post('/auth/login', (req, res) => {
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

router.post('/auth/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

router.get('/auth/notifications', authenticateToken, async (req, res) => {
    try {
        console.log("Returning notifications:", notificationsStore);
        res.status(200).json(notificationsStore);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

router.post('/cred/add', authenticateToken, async (req, res) => {
    const { fields, validityPeriod } = req.body;
    const credentialWithId = { id: uuidv4(), fields, validityPeriod };
    credentialsStore.push(credentialWithId);

    const nameField = fields.find(field => field.name === 'Name of Credential');
    const notification = {
        id: uuidv4(),
        message: `The credential "${nameField.value}" has been approved by UNSW. Now you can manage this credential in View Credentials.`,
        timestamp: new Date(),
    };
    notificationsStore.unshift(notification);

    console.log("Received credentials:", credentialWithId);
    console.log("Added notification:", notification);
    res.status(200).json(credentialWithId);
});

router.get('/cred/list', authenticateToken, async (req, res) => {
    try {
        const credentialsList = credentialsStore.map(credential => {
            const credentialName = credential.fields.find(field => field.name === 'Name of Credential')?.value;
            return {
                id: credential.id,
                credentialName: credentialName,
                validityPeriod: credential.validityPeriod 
            };
        });
        console.log("Returning credentials:", credentialsList);
        res.status(200).json(credentialsList);
    } catch (error) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ message: 'Error fetching credentials' });
    }
});

router.get('/cred/:id', authenticateToken, async (req, res) => {
    try {
        const credential = credentialsStore.find(c => c.id === req.params.id);
        if (credential) {
            res.status(200).json(credential);
        } else {
            res.status(404).send('Credential not found');
        }
    } catch (error) {
        console.error('Error fetching credential:', error);
        res.status(500).json({ message: 'Error fetching credential' });
    }
});

router.delete('/cred/:id', authenticateToken, async (req, res) => {
    try {
        const credentialIndex = credentialsStore.findIndex(c => c.id === req.params.id);
        if (credentialIndex !== -1) {
            const [deletedCredential] = credentialsStore.splice(credentialIndex, 1);
            const nameField = deletedCredential.fields.find(field => field.name === 'Name of Credential');
            const notification = {
                id: uuidv4(),
                message: `The request for deletion of the credential "${nameField.value}" was successful.`,
                timestamp: new Date(),
            };
            notificationsStore.unshift(notification);

            console.log("Deleted credential:", deletedCredential);
            console.log("Added notification:", notification);
            res.status(200).json({ message: 'Credential deleted successfully' });
        } else {
            res.status(404).send('Credential not found');
        }
    } catch (error) {
        console.error('Error deleting credential:', error);
        res.status(500).json({ message: 'Error deleting credential' });
    }
});

module.exports = router;
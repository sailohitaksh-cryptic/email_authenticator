// server.js (Email Authenticator)
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// --- In-Memory Store for Verification Codes 
const verificationCodes = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer Transporter Setup for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

console.log(`📧 Nodemailer configured to send emails from: ${process.env.EMAIL_USER}`);

// --- API Endpoint to Send Verification Code ---
app.post('/api/send-code', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    // 1. Generate a secure, random 16-character code
    const code = crypto.randomBytes(8).toString('hex').toUpperCase();

    // 2. Store the code and a timestamp (valid for 10 minutes)
    const expiration = Date.now() + 10 * 60 * 1000; 
    verificationCodes.set(email, { code, expiration });

    console.log(`Generated code ${code} for ${email}. It expires at ${new Date(expiration).toLocaleTimeString()}.`);

    // 3. Send the code to the user's email
    const mailOptions = {
        from: `"Your App Authentication" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
            <h1>Email Verification</h1>
            <p>Hello,</p>
            <p>Your verification code is:</p>
            <h2 style="text-align:center; letter-spacing: 2px; color: #333;">${code}</h2>
            <p>This code is valid for 10 minutes. Please enter it on the verification page.</p>
            <p>The email address this was sent to is: <b>${email}</b>.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification code sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send verification code.' });
    }
});

// --- API Endpoint to Verify the Code ---
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required.' });
    }

    const storedData = verificationCodes.get(email);

    // Check 1: Is there a code for this email?
    if (!storedData) {
        return res.status(400).json({ message: 'Invalid request. Please request a new code.' });
    }

    // Check 2: Has the code expired?
    if (Date.now() > storedData.expiration) {
        verificationCodes.delete(email); // Clean up expired code
        return res.status(400).json({ message: 'Your verification code has expired. Please request a new one.' });
    }

    // Check 3: Does the code match?
    if (storedData.code === code.toUpperCase()) {
        verificationCodes.delete(email); // Code is used, delete it
        return res.status(200).json({ message: '✅ Email successfully authenticated!' });
    } else {
        return res.status(400).json({ message: 'Invalid code. Please try again.' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

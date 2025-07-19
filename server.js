// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Pool
const dbPool = mysql.createPool({
    host: 'localhost', // or your MySQL host
    user: 'root',      // your MySQL username
    password: 'cryptic', // your MySQL password
    database: 'email_system'
});

// Nodemailer Transporter Setup with Ethereal
async function setupNodemailer() {
    // Create a test account with Ethereal
    let testAccount = await nodemailer.createTestAccount();

    console.log("Ethereal test account created:");
    console.log("User: %s", testAccount.user);
    console.log("Password: %s", testAccount.pass);
    console.log("------------------------------------");


    // Create a transporter object using the SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    return transporter;
}

// Main API Route
app.post('/api/subscribe', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        // 1. Store user in the database
        const connection = await dbPool.getConnection();
        const [result] = await connection.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
        connection.release();
        console.log(`User ${name} with email ${email} saved to database.`);

        // 2. Send confirmation email
        const transporter = await setupNodemailer();
        const mailOptions = {
            from: '"Your App Name" <no-reply@yourapp.com>',
            to: email, // The user's email address
            subject: '✅ Confirmation: Welcome!',
            html: `
                <h1>Hi ${name}!</h1>
                <p>Thank you for subscribing.</p>
                <p>We have successfully registered your email address: <b>${email}</b>.</p>
                <p>Best regards,<br>The Team</p>
            `
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        // Log the URL to preview the sent email in the Ethereal inbox
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(200).json({ 
            message: 'Subscription successful! Please check your email for confirmation.',
            previewURL: nodemailer.getTestMessageUrl(info) 
        });

    } catch (error) {
        console.error('Error:', error);
        // Check for duplicate entry error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'This email address is already subscribed.' });
        }
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
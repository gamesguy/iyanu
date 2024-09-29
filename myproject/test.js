// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'smtp.gmail.com'
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.sendMail({
    from: process.env.EMAIL,
    to: 'test@example.com',
    subject: 'Test Email',
    text: 'This is a test email.'
}, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});

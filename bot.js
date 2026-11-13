const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
        pass: process.env.GMAIL_PASS || ''
    }
});

app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM - Server & Web Keep-Alive Active 24/7/365');
});

app.listen(PORT, () => {
    console.log(`[✔] Web server running on port ${PORT}`);
});

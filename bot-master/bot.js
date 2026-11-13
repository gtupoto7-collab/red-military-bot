const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// GMAIL SMTP CONFIGURATION
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
        pass: process.env.GMAIL_PASS || ''
    }
});

// KEEP-ALIVE WEB ENDPOINT ZA RAILWAY / RENDER (Държи връзката 24/7 зелена)
app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM - Server & Web Keep-Alive Active 24/7/365');
});

// API за имейли и лидове от платформата
app.post('/api/lead', async (req, res) => {
    const { email, service, phone } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
            to: 'gtupoto7@gmail.com',
            subject: `🔥 НОВ ЛИД ОТ СИСТЕМАТА: ${service || 'Услуга'}`,
            text: `Телефон/Viber: ${phone || 'Не е посочен'}\nEmail: ${email}\nУслуга: ${service}`
        });
        res.status(200).json({ success: true, message: 'Имейлът е изпратен успешно!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[✔] Web server running on port ${PORT}`);
});

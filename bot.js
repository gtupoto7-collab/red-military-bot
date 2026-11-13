const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const https = require('https');
const nodemailer = require('nodemailer');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0',
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw',
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI',
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0',
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
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

async function sendSingleEmail(toEmail, subject, textContent) {
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
            to: toEmail,
            subject: subject,
            text: textContent
        });
        console.log(`[✔] Имейлът е изпратен успешно до: ${toEmail}`);
    } catch (error) {
        console.error(`[✖] Грешка при изпращане на имейл до ${toEmail}:`, error.message);
    }
}

// HTTP endpoint за поддържане на връзката жива (Keep-Alive за Railway/Render)
app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM - Bot Network & Services Active 24/7/365');
});

app.listen(PORT, () => {
    console.log(`[✔] Web server running on port ${PORT}`);
});

// Стартиране на ботовете с гъвкава проверка, така че грешка в токен да не спира сървъра
TOKENS.forEach((token, index) => {
    if (!token || token.includes('YOUR_')) return;
    try {
        const bot = new Telegraf(token);
        
        bot.start((ctx) => {
            ctx.reply('🔥 Добре дошъл в официалната система на RED SOFTWARE TEAM!\n\n🌐 Безсмъртни сайтове за 50 € с вечен хостинг и 7 дни безплатен тест.\n📞 Viber / Tel: 0879 813 928');
        });

        bot.launch().catch(err => {
            console.log(`[!] Забележка за Бот #${index + 1}: ${err.message}`);
        });
        
        console.log(`[✔] Бот #${index + 1} инициализиран успешно!`);
    } catch (err) {
        console.error(`[✖] Грешка при стартиране на бот #${index + 1}:`, err.message);
    }
});
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM - Server & Web Keep-Alive Active 24/7/365');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

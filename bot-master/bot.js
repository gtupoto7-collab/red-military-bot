const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const nodemailer = require('nodemailer');

// TSENTRALEN MASIV S VSIchKI TOTOKENI NA FERMATA
const BOT_TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', // Master Control
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', // Servisni
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', // Red Coin / Stars
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', // Fullstack Builder
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  // Spam / Oferti
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// GMAIL SMTP INTEGRATSIYA ZA IZVESTIYA I OFERTI
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
        pass: process.env.GMAIL_PASS || ''
    }
});

// KEEP-ALIVE WEB ENDPOINT ZA RAILWAY / RENDER (Dahrji vrazkata 24/7)
app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM - CENTRAL BOT-FATHER FARM ACTIVE 24/7/365');
});

// API endpoint za vrazka s platformata iuvlechenie na lidi
app.post('/api/lead', async (req, res) => {
    const { email, service, phone } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER || 'gtupoto7@gmail.com',
            to: 'gtupoto7@gmail.com',
            subject: `🔥 NOV LID OT FERMATA: ${service}`,
            text: `Klient: ${phone || 'Neznam'}\nEmail: ${email}\nUslugata: ${service}`
        });
        res.status(200).json({ success: true, message: 'Lidut e praten uspeshno!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`[✔] Tsentralniyat Bot-Father sarvar raboti na port ${PORT}`);
});

// STARTE NA VSIchKI BOTOVE OT FERMATA S PATCHVANE NA GRESHKITE (Da ne garmat)
BOT_TOKENS.forEach((token, index) => {
    if (!token || token.includes('YOUR_')) return;
    try {
        const bot = new Telegraf(token);
        
        bot.start((ctx) => {
            ctx.reply('🔥 Zdrasti! Tova e tsentralniyat portal na RED SOFTWARE TEAM.\n\n🌐 Izgotviane na saytove, botove i sistemi.\n📞 Viber / Tel: 0879 813 928',
                Markup.inlineKeyboard([
                    [Markup.button.url('🌐 Poseti Vitrinata', 'https://redsoftwareteam-oficial.onrender.com/')],
                    [Markup.button.url('💻 Interaktiven Panel', 'https://red-software-dashbord.onrender.com/')]
                ])
            );
        });

        // Zashtita ot falit pri sriv na edin token
        bot.launch().catch(err => {
            console.log(`[!] Zabelejka za Bot #${index + 1} vuv fermata: ${err.message}`);
        });

        console.log(`[✔] Bot #${index + 1} ot fermata e v stroia online!`);
    } catch (err) {
        console.error(`[✖] Kriticna greshka pri Bot #${index + 1}:`, err.message);
    }
});

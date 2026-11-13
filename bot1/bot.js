const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const https = require('https');
const nodemailer = require('nodemailer');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', 
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY',
    process.env.BOT_TOKEN_6 || '' // <--- NOVOTU VKARAN BOT ZA 24/7 GRUPEN SPAM I KANENE
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
        const info = await transporter.sendMail({
            from: `"OFFICIAL RED SOFTWARE TEAM" <${process.env.GMAIL_USER || 'gtupoto7@gmail.com'}>`,
            to: toEmail,
            subject: subject,
            text: textContent
        });
        console.log(`Email sent successfully to ${toEmail}: ${info.response}`);
        return true;
    } catch (error) {
        console.error(`Email dispatch error for ${toEmail}:`, error.message);
        return false;
    }
}

// 🧠 UMEN GMAIL DISPATCHER: 10 pratri po 50 imejla (obshto do 500 na den)
async function runSmartEmailCampaign(recipientsList, subject, message) {
    let batchSize = 50;
    let totalSent = 0;
    
    console.log(`Starting campaign for ${recipientsList.length} recipients (10 batches of 50)...`);

    for (let i = 0; i < recipientsList.length; i += batchSize) {
        if (totalSent >= 500) break;

        const batch = recipientsList.slice(i, i + batchSize);
        for (const email of batch) {
            if (totalSent >= 500) break;
            await sendSingleEmail(email, subject, message);
            totalSent++;
            await new Promise(resolve => setTimeout(resolve, 4000));
        }

        if (i + batchSize < recipientsList.length && totalSent < 500) {
            await new Promise(resolve => setTimeout(resolve, 144 * 60 * 1000));
        }
    }
}

// 1. STARTIRANE NA VSICHKI BOTOVE (VKLUCHITELNO NOVIYA ZA 24/7 GRUPEN SPAM I KANENE)
TOKENS.forEach((token, index) => {
    if (!token || token.length < 20) return;
    
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                const userName = ctx.from.first_name || 'Priyatel';
                
                const storeText = `🔥 **OFFICIAL RED SOFTWARE TEAM | Bulgariya iziskuje vissha klasa!** 🔥\n\n` +
                    ` Zdravei, **${userName}**!\n` +
                    `Bezmrutni saitove za malki firmi i maistori v Bulgariya za 50 € s 7 dni napulno bezplaten test i plashtash sled testa prez EasyPay!\n\n` +
                    `⭐ Konsola za realno plashtane i pazaruvane sys Telegram Stars.\n` +
                    `💎 Nalichen budzhet: 3,100 Stars\n` +
                    `💼 Keeper Wallet: \`${KEEPER_WALLET}\``;

                const storeKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                    [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                    [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                    [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                    [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                    [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50050')],
                    [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
                    [Markup.button.url('💳 Kupi istinski zvezdi (Magazin)', 'https://t.me/premium')],
                    [Markup.button.callback('💰 Prexvorli kam Keeper (Realni pari)', 'withdraw_keeper')],
                    [Markup.button.url('🔥 Portfolior & Tablo', 'https://red-software-dashbord.onrender.com')],
                    [Markup.button.url('🌐 Oficialen Portal', 'https://redsoftwareteam-oficial.onrender.com')]
                ]);

                await ctx.reply(storeText, {
                    parse_mode: 'Markdown',
                    ...storeKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50050', 'buy_150000'];

        bot.action(packageActions, async (ctx) => {
            try {
                await ctx.answerCbQuery();
                const action = ctx.match;
                let count = 250;
                if (action === 'buy_500') count = 500;
                if (action === 'buy_1000') count = 1000;
                if (action === 'buy_2500') count = 2500;
                if (action === 'buy_10000') count = 10000;
                if (action === 'buy_50050') count = 50050;
                if (action === 'buy_150000') count = 150000;

                try {
                    await ctx.replyWithInvoice({
                        title: `Paket ${count} Telegram Stars`,
                        description: `Zakupuvane na ${count} zvezdi za mrezhata i Keeper portfeila.`,
                        payload: `store_${count}_${Date.now()}`,
                        currency: 'XTR',
                        prices: [{ label: `${count} Stars`, amount: count }]
                    });
                } catch (e) {
                    await ctx.reply(
                        `⭐ **KONSOLA ZA PLASHTANE: ${count} Telegram Stars**\n\n` +
                        `Balansyt v akanta e nula. Za da kupish istinski zvezdi, izpolzvai oficialniya magazin: https://t.me/premium\n\n` +
                        `Ili prevejdai direktno kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                        { parse_mode: 'Markdown' }
                    );
                }
            } catch (e) {}
        });

        bot.action('withdraw_keeper', async (ctx) => {
            try {
                await ctx.answerCbQuery('Sveryavane...');
                await ctx.reply(
                    `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
                    `Prichodite sa svurzani s tvoia portfeil:\n\`${KEEPER_WALLET}\``,
                    { parse_mode: 'Markdown' }
                );
            } catch (e) {}
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            try {
                const payment = ctx.message.successful_payment;
                await ctx.reply(`🎉 Uspeshna pokupka na ${payment.total_amount} Telegram Stars! Sredstvata sa svurzani s Keeper portfeila.`);
            } catch (e) {}
        });

        bot.launch().then(() => {
            console.log(`24/7 Bot #${index + 1} online.`);
        }).catch(err => {});

    } catch (e) {}
});

// 2. API ZA STARTIRANE NA IMЕЙЛ КАМПАНИЯ (10 pratri po 50 = 500)
app.post('/api/start-campaign', async (req, res) => {
    const { recipients, subject, message } = req.body;
    if (!recipients || !Array.isArray(recipients) || !message) {
        return res.status(400).json({ error: "Missing 'recipients' array or 'message'." });
    }
    res.json({ status: "CAMPAIGN STARTED", totalRecipients: recipients.length, note: "Smart queue running: 10 batches of 50 emails up to 500 daily limit." });
    runSmartEmailCampaign(recipients, subject || "🌐 Bezsmurten sait za vashata deinost s 7 dni bezplaten test | RED SOFTWARE TEAM", message);
});

// 3. EXPRESS SURVAR S KEEP-ALIVE PING ZA 24/7 AKTIVNOST
app.get('/', (req, res) => res.json({ status: "FULL 24/7 NETWORK, 6 BOTS, STARS CONSOLE & GMAIL DISPATCHER ONLINE", keeperWallet: KEEPER_WALLET }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    setInterval(() => {
        const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.RAILWAY_STATIC_URL;
        if (appUrl) {
            const targetUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
            https.get(targetUrl, (res) => {}).on('error', (err) => {});
        }
    }, 4 * 60 * 1000);
});

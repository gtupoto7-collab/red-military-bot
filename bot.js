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

const adCaption = `🔥 OFFICIAL RED SOFTWARE TEAM | Telegram Stars &\n\nKeeper: \`${KEEPER_WALLET}\``;
const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ Kupi 100 Zvezdi', 'buy_100')],
    [Markup.button.url('👥 Vlez v grupata', 'https://t.me/+HTJNMe-pUeEzNmY0')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);
        bot.start((ctx) => ctx.replyWithPhoto(mainCoverImage, { caption: adCaption, parse_mode: 'Markdown', ...inlineMenu }));
        
        bot.action('buy_100', async (ctx) => {
            await ctx.answerCbQuery('Invojs za zvezdi...');
            await ctx.replyWithInvoice({
                title: '100 Telegram Stars',
                description: 'Pokupka kym Keeper',
                payload: 'stars_100',
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: '100 Stars', amount: 100 }]
            });
        });

        bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
        bot.on('successful_payment', (ctx) => {
            systemStats.starsPurchasesProcessed++;
            ctx.reply(`Uspeshna pokupka! Sredstvata se prenasochvat kym Keeper: \`${KEEPER_WALLET}\``, { parse_mode: 'Markdown' });
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
        await senderBot.telegram.sendPhoto(targetGroup, mainCoverImage, { caption: adCaption, parse_mode: 'Markdown', ...inlineMenu });
        systemStats.totalSentAds++;
    } catch (err) {}
}, 60 * 1000);

app.get('/', (req, res) => res.json({ status: "OK", stats: systemStats }));
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

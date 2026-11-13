const { Telegraf, Markup } = require('telegraf');
const express = require('express');

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

let systemStats = {
    activeBotsCount: TOKENS.length,
    activeStarsBudget: 3100,
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const starsMenuCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
    `Избери точен пакет от менюто:\n\n` +
    `💎 **Наличен бюджет:** 3,100 Stars\n` +
    `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\``;

const starsKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
    [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
    [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
    [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
    [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
    [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50000')],
    [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
    [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('👥 Влез в групата', 'https://t.me/+HTJNMe-pUeEzNmY0')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REDSOFTWARE BOT #${index + 1} ONLINE]\n\n` + starsMenuCaption,
                    parse_mode: 'Markdown',
                    ...starsKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50000', 'buy_150000'];

        bot.action(packageActions, async (ctx) => {
            await ctx.answerCbQuery();
            const action = ctx.match;
            let count = 250;
            if (action === 'buy_500') count = 500;
            if (action === 'buy_1000') count = 1000;
            if (action === 'buy_2500') count = 2500;
            if (action === 'buy_10000') count = 10000;
            if (action === 'buy_50000') count = 50000;
            if (action === 'buy_150000') count = 150000;

            try {
                await ctx.replyWithInvoice({
                    title: `Пакет ${count} Telegram Stars`,
                    description: `Закупуване на ${count} звезди за мрежата на Red Software.`,
                    payload: `stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (err) {
                await ctx.reply(
                    `⭐ **ПОРТФЕЙЛ ЗА ПЛАЩАНЕ (${count} Stars)**\n\n` +
                    `Направете превод към официалния Keeper портфейл:\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `Или посетете платформата:\n` +
                    `👉 https://red-software-dashbord.onrender.com`,
                    { parse_mode: 'Markdown', ...starsKeyboard }
                );
            }
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "ALL PACKAGES STORE ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Store server running on port ${PORT}`));

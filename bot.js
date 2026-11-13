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
    `Izberi paket za istinsko plashtane i zaredvane na zvezdi:\n\n` +
    `💎 **Nalichen budzhet:** 3,100 Stars\n` +
    `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\``;

// Vvuzvreme vsichki paketi s reallno raboteshti Telegram Stars checkout links
const starsKeyboard = Markup.inlineKeyboard([
    [Markup.button.url('⭐ 250 Stars (4.29 €)', 'https://t.me/tme/reklamabot?start=invoice_250')],
    [Markup.button.url('⭐ 500 Stars (8.39 €)', 'https://t.me/tme/reklamabot?start=invoice_500')],
    [Markup.button.url('⭐ 1 000 Stars (16.59 €)', 'https://t.me/tme/reklamabot?start=invoice_1000')],
    [Markup.button.url('⭐ 2 500 Stars (40.99 €)', 'https://t.me/tme/reklamabot?start=invoice_2500')],
    [Markup.button.url('⭐ 10 000 Stars (164.99 €)', 'https://t.me/tme/reklamabot?start=invoice_10000')],
    [Markup.button.url('⭐ 50 000 Stars (819.00 €)', 'https://t.me/tme/reklamabot?start=invoice_50000')],
    [Markup.button.url('⭐ 150 000 Stars (2 459.00 €)', 'https://t.me/tme/reklamabot?start=invoice_150000')],
    [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
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

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "ALL STARS LINKS ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Store server running on port ${PORT}`));

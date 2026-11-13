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
    `Izberi paket ot nai-malkite do nai-golemite zvezdi:\n\n` +
    `💎 **Nalichen budzhet:** 3,100 Stars\n` +
    `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\``;

const starsKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ 200 Stars (Malak paket)', 'buy_200')],
    [Markup.button.callback('⭐ 1 000 Stars (Sreden)', 'buy_1000')],
    [Markup.button.callback('⭐ 3 100 Stars (Reklamen kampanen)', 'buy_3100')],
    [Markup.button.callback('⭐ 10 000 Stars', 'buy_10000')],
    [Markup.button.callback('⭐ 50 000 Stars', 'buy_50000')],
    [Markup.button.callback('⭐ 150 000 Stars (Maksimalen)', 'buy_150000')],
    [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('👥 Vlez v grupata', 'https://t.me/+HTJNMe-pUeEzNmY0')]
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

        // Obsht handler za vsichki paketi ot 200 do 150 000 zvezdi
        bot.action(['buy_200', 'buy_1000', 'buy_3100', 'buy_10000', 'buy_50000', 'buy_150000'], async (ctx) => {
            await ctx.answerCbQuery();
            const actionData = ctx.match;
            let count = 200;
            if (actionData === 'buy_1000') count = 1000;
            if (actionData === 'buy_3100') count = 3100;
            if (actionData === 'buy_10000') count = 10000;
            if (actionData === 'buy_50000') count = 50000;
            if (actionData === 'buy_150000') count = 150000;

            try {
                await ctx.replyWithInvoice({
                    title: `Paket ${count} Telegram Stars`,
                    description: `Zakupuvane na ${count} zvezdi za Red Software Mrezata i Botove.`,
                    payload: `stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (err) {
                await ctx.reply(
                    `⭐ **PORTFEIL ZA PLASHTANE (${count} Stars)**\n\n` +
                    `Prevedete cyrcata ili plashtaneto kym Keeper Portfeila:\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `Ili izpolzvaite platformata:\n` +
                    `👉 https://red-software-dashbord.onrender.com`,
                    { parse_mode: 'Markdown', ...starsKeyboard }
                );
            }
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "FULL STARS STORE ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Full store server running on port ${PORT}`));

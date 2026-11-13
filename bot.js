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

const starsMenuCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars & Store** ⭐\n\n` +
    `Izberi paket zvezdi za kupuvane ili razgledai platformite:\n\n` +
    `💎 **Nalichen budzhet:** 3,100 Stars\n` +
    `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\``;

const starsKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ Kupis 100 Stars (1€)', 'buy_100')],
    [Markup.button.callback('⭐ Kupis 500 Stars (5€)', 'buy_500')],
    [Markup.button.callback('⭐ Kupis 3100 Stars (31€)', 'buy_3100')],
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

        // Edinichni buy handlers za paketite
        bot.action(['buy_100', 'buy_500', 'buy_3100'], async (ctx) => {
            await ctx.answerCbQuery();
            const starsCount = ctx.match === 'buy_100' ? 100 : ctx.match === 'buy_500' ? 500 : 3100;
            const priceEuro = starsCount / 100;

            // Izprashtane na Telegram Stars Invoice za plashtane
            try {
                await ctx.replyWithInvoice({
                    title: `Paket ${starsCount} Telegram Stars`,
                    description: `Zakupuvane na ${starsCount} zvezdi za Oficialnata Red Software Mreza.`,
                    payload: `stars_${starsCount}_${Date.now()}`,
                    currency: 'XTR', // Telegram Stars valuta
                    prices: [{ label: `${starsCount} Stars`, amount: starsCount }]
                });
            } catch (invoiceErr) {
                // Alternativa ako invoice iziskva Provider Token
                await ctx.reply(
                    `⭐ **PORTFEIL ZA PLASHTANE (${starsCount} Stars - ${priceEuro}€)**\n\n` +
                    `Prevedete cyrcata ili plashtaneto kym Keeper Portfeila:\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `Ili platete prez EasyPay / platformite:\n` +
                    `👉 https://red-software-dashbord.onrender.com`,
                    { parse_mode: 'Markdown', ...starsKeyboard }
                );
            }
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "STARS STORE ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Store server running on port ${PORT}`));

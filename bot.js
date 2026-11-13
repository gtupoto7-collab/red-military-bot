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

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            const userName = ctx.from.first_name || 'Приятел';
            const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'без username';

            const starsMenuCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars & Donate** ⭐\n\n` +
                `Здравей, **${userName}** (${userUsername})!\n` +
                `Избери опция за дарение или покупка на звезди:\n\n` +
                `💎 **Наличен бюджет в мрежата:** 3,100 Stars\n` +
                `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\``;

            // Добавен е специален бутон за бързо дарение с Telegram Stars
            const starsKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🎁 Направи Donate (100 Stars)', 'donate_100')],
                [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                [Markup.button.callback('⭐ 3 100 Stars (Кампанен пакет)', 'buy_3100')],
                [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REDSOFTWARE BOT #${index + 1} ONLINE]\n\n` + starsMenuCaption,
                    parse_mode: 'Markdown',
                    ...starsKeyboard
                });
            } catch (err) {}
        });

        // Обработка на бутона за дарение и пакетите
        bot.action(['donate_100', 'buy_250', 'buy_500', 'buy_1000', 'buy_3100'], async (ctx) => {
            await ctx.answerCbQuery();
            const action = ctx.match;
            let count = 100;
            let title = 'Дарение (Donate) с Telegram Stars';
            
            if (action === 'buy_250') count = 250;
            if (action === 'buy_500') count = 500;
            if (action === 'buy_1000') count = 1000;
            if (action === 'buy_3100') count = 3100;
            if (action !== 'donate_100') title = `Пакет ${count} Telegram Stars`;

            try {
                await ctx.replyWithInvoice({
                    title: title,
                    description: `Подкрепете OFFICIAL RED SOFTWARE TEAM с ${count} Telegram Stars.`,
                    payload: `stars_donation_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (err) {
                await ctx.reply(
                    `⭐ **${title}**\n\n` +
                    `За да завършите дарението/плащането, преведете сумата към официалния Keeper портфейл:\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `Или посетете платформата: https://red-software-dashbord.onrender.com`,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            const payment = ctx.message.successful_payment;
            await ctx.reply(`🎉 Благодарим ви за подкрепата с ${payment.total_amount} Telegram Stars! Транзакцията е регистрирана успешно.`);
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "DONATE & STARS ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

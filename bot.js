const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// Definirane na tokenite spored rolyata
const PAYMENT_BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw'; // @Vickyoria_a_bot
const ADS_BOT_TOKEN = process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';     // @red_software_bot (reklamen)
const SPAMMER_BOT_TOKEN = process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI';  // @redcoinofficial_bot (auto-spamer)

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

// 1. @Vickyoria_a_bot - SPETSIALIZIRAN MAGAZIN ZA PLASHTANIQ I ZVEZDI
try {
    const payBot = new Telegraf(PAYMENT_BOT_TOKEN);

    payBot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Priyatel';
        
        const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
            `Zdravei, **${userName}**!\n` +
            `Tova e oficialnoto magazin-menu za reallni plashtaniq i zakupuvane na Telegram Stars.\n\n` +
            `💎 Nalichen budzhet: 3,100 Stars\n` +
            `💼 Keeper Wallet (za izplashtane): \`${KEEPER_WALLET}\``;

        const storeKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
            [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
            [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
            [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
            [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
            [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50000')],
            [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
            [Markup.button.url('💳 Kupi istinski zvezdi (Oficialen magazin)', 'https://t.me/premium')],
            [Markup.button.callback('💰 Prexvorli kam Keeper (Realni pari)', 'withdraw_keeper')],
            [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
        ]);

        try {
            await ctx.replyWithPhoto(mainCoverImage, {
                caption: `🤖 [@Vickyoria_a_bot | PAYMENT STORE ACTIVE]\n\n` + storeCaption,
                parse_mode: 'Markdown',
                ...storeKeyboard
            });
        } catch (err) {
            await ctx.reply(storeCaption, { parse_mode: 'Markdown', ...storeKeyboard });
        }
    });

    const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50000', 'buy_150000'];

    payBot.action(packageActions, async (ctx) => {
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
                title: `Paket ${count} Telegram Stars`,
                description: `Zakupuvane na ${count} zvezdi ot @Vickyoria_a_bot.`,
                payload: `store_stars_${count}_${Date.now()}`,
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

    payBot.action('withdraw_keeper', async (ctx) => {
        await ctx.answerCbQuery('Sveryavane...');
        await ctx.reply(
            `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
            `Prichodite sa nasocheni kam:\n\`${KEEPER_WALLET}\``,
            { parse_mode: 'Markdown' }
        );
    });

    payBot.on('pre_checkout_query', async (ctx) => {
        try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
    });

    payBot.on('successful_payment', async (ctx) => {
        const payment = ctx.message.successful_payment;
        await ctx.reply(`🎉 Uspeshna pokupka na ${payment.total_amount} Telegram Stars! Sredstvata sa svurzani s Keeper portfeila.`);
    });

    payBot.launch();
    console.log("Payment store bot (@Vickyoria_a_bot) started.");
} catch (e) {}

// 2. @red_software_bot - REKLAMEN BOT
try {
    const adsBot = new Telegraf(ADS_BOT_TOKEN);
    adsBot.start(async (ctx) => {
        const adsText = `📢 **OFFICIAL RED SOFTWARE TEAM | Reklamen Hub** 📢\n\n` +
            `Tozi bot e reklamen portal. Za da izpolzvash magazina za Telegram Stars i reallni plashtaniya, otvori speczializiraniya bot:`;
        
        const adsKeyboard = Markup.inlineKeyboard([
            [Markup.button.url('🛒 Otvori Magazin za Plashtane (@Vickyoria_a_bot)', 'https://t.me/Vickyoria_a_bot')],
            [Markup.button.url('🔥 Platforma', 'https://red-software-dashbord.onrender.com')]
        ]);
        await ctx.reply(adsText, { parse_mode: 'Markdown', ...adsKeyboard });
    });
    adsBot.launch();
    console.log("Ads bot (@red_software_bot) started.");
} catch (e) {}

// 3. @redcoinofficial_bot - AUTO-SPAMER BOT
try {
    const spammerBot = new Telegraf(SPAMMER_BOT_TOKEN);
    let isSpamming = false;

    spammerBot.start(async (ctx) => {
        const spamText = `🤖 **REDCOINOFFICIAL | Auto-Spamer & Dispatcher** 🤖\n\n` +
            `Auto-spamer botyt e aktiven i generira mrezhovi signali.\n` +
            `Za plashtaniya i zvezdi izpolzvai: @Vickyoria_a_bot`;

        const spamKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🚀 Pusni Avto-Spam Signali', 'trigger_spam')],
            [Markup.button.url('🛒 Magazin za Plashtane (@Vickyoria_a_bot)', 'https://t.me/Vickyoria_a_bot')]
        ]);
        await ctx.reply(spamText, { parse_mode: 'Markdown', ...spamKeyboard });
    });

    spammerBot.action('trigger_spam', async (ctx) => {
        await ctx.answerCbQuery('Auto-spamer mrezhata e aktivirana!');
        await ctx.reply(`⚡ **AUTO-SPAM ENGINE ACTIVE**\n\nRezvani syobshtenia i reklamni signali se izprashtat kym vsički mrezhovi kanali 24/7.`);
    });

    spammerBot.launch();
    console.log("Auto-spamer bot (@redcoinofficial_bot) started.");
} catch (e) {}

app.get('/', (req, res) => res.json({ 
    status: "FULL BOT NETWORK ACTIVE", 
    paymentBot: "@Vickyoria_a_bot",
    adsBot: "@red_software_bot",
    spammerBot: "@redcoinofficial_bot",
    keeperWallet: KEEPER_WALLET 
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

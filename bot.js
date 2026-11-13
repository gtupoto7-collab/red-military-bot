const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw';
const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

try {
    const bot = new Telegraf(BOT_TOKEN);

    bot.start(async (ctx) => {
        const userName = ctx.from.first_name || 'Приятел';
        
        // 1. Текстово съобщение с офертата и информацията
        const infoText = `🔥 **OFFICIAL RED SOFTWARE TEAM | Bot Network Active** 🔥\n\n` +
            `Здравей, **${userName}**!\n` +
            `⭐ Рекламна Кампания (Бюджет: 3100 Stars в Telegram Ads): Активно промотиране на главния бот @redsoftwarebot!\n\n` +
            `🌐 Безсмъртни сайтове за 50 € & AI Системи\n` +
            `• 7 дни напълно безплатен тест\n` +
            `• Плащаш 50 евро след теста през EasyPay\n` +
            `• Вечен сървър без прекъсване\n\n` +
            `💎 Наличен бюджет в мрежата: 3,100 Stars\n` +
            `💼 Keeper Wallet (за изплащане): \`${KEEPER_WALLET}\``;

        await ctx.reply(infoText, { parse_mode: 'Markdown' });

        // 2. Отделно, чисто меню с бутоните за плащане и пазаруване, което гарантирано излиза на екрана
        const storeKeyboard = Markup.inlineKeyboard([
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

        await ctx.reply('🛒 **МЕНЮ ЗА ПАЗАРУВАНЕ И ПЛАЩАНЕ С TELEGRAM STARS:**', {
            parse_mode: 'Markdown',
            ...storeKeyboard
        });
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
                description: `Покупка на ${count} звезди през менюто за плащане.`,
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

    bot.on('successful_panel', async (ctx) => {});
    bot.on('successful_payment', async (ctx) => {
        const payment = ctx.message.successful_payment;
        await ctx.reply(`🎉 Успешна покупка на ${payment.total_amount} Stars! Средствата са свързани с Keeper портфейла.`);
    });

    bot.launch();
    console.log("Bot with separated store menu running.");
} catch (e) {}

app.get('/', (req, res) => res.json({ status: "MENU ACTIVE" }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

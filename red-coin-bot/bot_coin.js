const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI';
const bot = new Telegraf(BOT_TOKEN);

// Start komanda s pulen panel za plashtania
bot.start((ctx) => {
    ctx.reply(
        `🪙 *RED SOFTWARE TEAM - TELEGRAM STARS PANEL*\n\n` +
        `Zdrasti! Tuka mozesh da zakupish vsichki nashi uslugi, bezsmurtni saitove i bot sistemi chrez oficialnite Telegram Stars (Zvezdi)!\n\n` +
        `Izberi usluga ot menüto dolu:`,
        Markup.inlineKeyboard([
            [Markup.button.callback('🌐 Bezsmurten Sait (50€) - 250 Stars', 'buy_site')],
            [Markup.button.callback('🤖 Bot Ferma / Spam Agent - 350 Stars', 'buy_bot')],
            [Markup.button.callback('🧠 Custom AI Sistema - 500 Stars', 'buy_ai')],
            [Markup.button.callback('📞 Svyrzvane s Operator', 'contact_admin')]
        ])
    );
});

// Handler za zakupuvane na sait (Telegram Stars Invoice)
bot.action('buy_site', async (ctx) => {
    await ctx.answerCbQuery();
    // Izprashtame faktura / invoice za Telegram Stars
    await ctx.replyWithInvoice({
        title: 'Bezsmurten Biznes Sait',
        description: 'Izrabotka na profesionalen sait + vechen Render hosting + QR kod za 50€',
        payload: 'site_50eur_payload',
        currency: 'XTR', // XTR e kodut za Telegram Stars
        prices: [
            { label: 'Bezsmurten Sait', amount: 250 } // 250 Telegram Stars
        ]
    });
});

bot.action('buy_bot', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithInvoice({
        title: 'Avtomatizirana Bot Ferma',
        description: 'Telegram & FB bot za reklami i marketing',
        payload: 'bot_ferma_payload',
        currency: 'XTR',
        prices: [
            { label: 'Bot Ferma', amount: 350 }
        ]
    });
});

bot.action('buy_ai', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithInvoice({
        title: 'Custom AI Intelligence Sistema',
        description: 'Vissha klasa AI reshenie za vashiia biznes',
        payload: 'ai_system_payload',
        currency: 'XTR',
        prices: [
            { label: 'AI Sistema', amount: 500 }
        ]
    });
});

bot.action('contact_admin', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('📞 Za direktna vryzka i plashtane prez EasyPay: +359 879 813928 | Email: gtupoto7@gmail.com');
});

// Zadoljitelno uspeshno plashtane handler
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => {
    ctx.reply('🎉 Blagodaria za uspechnoto plashtane sas Telegram Stars! Nashijat ekip veche raboti po vashiia proekt. Zapoviadte vuv vishka grupa ili se obadete na +359 879 813928.');
});

bot.launch();
console.log('Red Coin Bot (Telegram Stars Panel) e stariran!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

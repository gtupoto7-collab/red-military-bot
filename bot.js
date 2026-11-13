const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', // @red_software_bot (Главен)
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', // Victoria Vasileva / Източник на звезди
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', // RED_COIN_BOT
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', // FULLSTACKRED_BOT
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  // Botmaika / MARAUDER
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

const starsMenuCaption = `⭐ **OFFICIAL RED SOFTWARE TEAM | Telegram Stars & Store** ⭐\n\n` +
    `Твоят център за покупка, управление и пренасочване на Telegram Stars и услуги!\n\n` +
    `💎 **Наличен рекламен бюджет:** 3,100 Stars\n` +
    `💼 **Keeper Wallet:** \`${KEEPER_WALLET}\`\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n\n` +
    `Избери опция от менюто по-долу:`;

const starsKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ Купи Telegram Stars', 'buy_stars')],
    [Markup.button.callback('🔄 Синхронизирай / Refund Stars', 'refund_stars')],
    [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('👥 Влез в групата', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Системен Статус', 'live_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REDSOFTWARE BOT #${index + 1} ONLINE]\n\n` + starsMenuCaption,
                    parse_mode: 'Markdown',
                    ...starsKeyboard
                });
            } catch (err) {}
        });

        bot.action('buy_stars', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(
                `⭐ **ПОКУПКА НА TELEGRAM STARS**\n\n` +
                `За да закупиш звезди или да заредиш баланс към твоя профил през официалната мрежа, използвай портфейла:\n\n` +
                `\`${KEEPER_WALLET}\`\n\n` +
                `След превод, звездите се автоматично разпределят към рекламните кампании и основните платформи!`,
                { parse_mode: 'Markdown', ...starsKeyboard }
            );
        });

        bot.action('refund_stars', async (ctx) => {
            await ctx.answerCbQuery();
            await ctx.reply(
                `🔄 **ВРЪЩАНЕ И ПРЕНАСОЧВАНЕ НА ЗВЕЗДИ**\n\n` +
                `Бюджетът от **3,100 Stars** е успешно насочен към кампанията в Telegram Ads за главния бот @red_software_bot. Можеш да управляваш разходите от рекламния панел.`,
                { parse_mode: 'Markdown', ...starsKeyboard }
            );
        });

        bot.action('live_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(
                `📊 **SYSTEM REPORT (Bot #${index + 1})**\n\n` +
                `⭐ Активни звезди: ${systemStats.activeStarsBudget} Stars\n` +
                `⏱️ Uptime: ${uptime} min\n` +
                `🟢 Статус: Online 24/7`,
                starsKeyboard
            );
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "STARS & BOTS 24/7 ONLINE", stats: systemStats }));
app.listen(PORT, () => console.log(`Stars store server running on port ${PORT}`));

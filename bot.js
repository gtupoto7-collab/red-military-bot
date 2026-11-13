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

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Bot Network Active** 🔥\n\n` +
    `⭐ **Рекламна Кампания (Бюджет: 3100 Stars в Telegram Ads):**\n` +
    `Активно промотиране на главния бот @red_software_bot!\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n` +
    `• Вечен сървър без прекъсване!\n\n` +
    `👉 **ПЛАТФОРМА 1:** https://red-software-dashbord.onrender.com\n` +
    `👉 **ПЛАТФОРМА 2:** https://redsoftwareteam-oficial.onrender.com\n` +
    `📢 **ТВОЯТА ГРУПА:** https://t.me/+HTJNMe-pUeEzNmY0\n` +
    `📞 **VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🔥 Разгледай Платформата', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('👥 Влез в групата', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Статус', 'live_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REDSOFTWARE BOT #${index + 1} ONLINE]\n\n` + adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
            } catch (err) {}
        });

        bot.action('live_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(`📊 **SYSTEM REPORT (Bot #${index + 1})**\n\n⭐ Рекламен бюджет: ${systemStats.activeStarsBudget} Stars\n⏱️ Uptime: ${uptime} min`, inlineMenu);
        });

        bot.launch();
    } catch (e) {}
});

app.get('/', (req, res) => res.json({ status: "BOTS 24/7 ONLINE", stats: systemStats }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

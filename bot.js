cat << 'EOF' > bot.js
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
    process.env.BOT_TOKEN_2 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_3 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_4 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  
];

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let systemStats = {
    totalSentAds: 0,
    activeBotsCount: TOKENS.length,
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Софтуер, AI модели, Bot ферми и Безсмъртни Сайтове** 🔥\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `Получаваш уебсайт, QR код и линк, който ще работи завинаги на Render сървъри. Пълна синхронизация в облака между лаптоп, телефон и Opera GX 24/7/365!\n\n` +
    `💡 **УСЛОВИЯ ЗА БЪЛГАРИЯ:**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n` +
    `• Вечен сървър, който работи за винаги без прекъсване!\n\n` +
    `👉 **ПЛАТФОРМА 1:** https://red-software-dashbord.onrender.com\n` +
    `👉 **ПЛАТФОРМА 2:** https://redsoftwareteam-oficial.onrender.com\n` +
    `📢 **ТВОЯТА ГРУПА (Влез тук):** https://t.me/+HTJNMe-pUeEzNmY0\n` +
    `📞 **VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🔥 Портфолио (Panel 1)', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('💎 Официален Сайт (Panel 2)', 'https://redsoftwareteam-oficial.onrender.com')],
    [Markup.button.url('👥 Влез в групата', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Общ Отчет (Stats)', 'live_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [BOT #${index + 1} ACTIVE]\n\n` + adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
            } catch (err) {
                console.error(`Bot ${index + 1} start error:`, err.message);
            }
        });

        bot.action('live_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(`📊 **SYSTEM REPORT (Bot #${index + 1})**\n\n` +
                `🚀 Общо реклами: ${systemStats.totalSentAds}\n` +
                `🤖 Активни ботове в мрежата: ${systemStats.activeBotsCount}\n` +
                `⏱️ Време на работа: ${uptime} min\n` +
                `💻 Status: 24/7 ONLINE`, inlineMenu);
        });

        bot.launch().then(() => {
            console.log(`[BOT #${index + 1}] Стартиран успешно и работи 24/7!`);
        });

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

    } catch (e) {
        console.log(`Greshka pri bot #${index + 1}:`, e.message);
    }
});

async function startMasterNetworkSpam() {
    console.log(`[MASTER NETWORK] Активирана мрежа за масово разпространение!`);
    let groupIndex = 0;

    setInterval(async () => {
        if (!allTargets || allTargets.length === 0) return;
        if (groupIndex >= allTargets.length) groupIndex = 0;

        const targetGroup = allTargets[groupIndex];
        groupIndex++;

        const activeToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
        const senderBot = new Telegraf(activeToken);

        try {
            await senderBot.telegram.sendPhoto(targetGroup, mainCoverImage, {
                caption: adCaption,
                parse_mode: 'Markdown',
                ...inlineMenu
            });
            systemStats.totalSentAds++;
            console.log(`[NETWORK SUCCESS] Реклама пратена до ${targetGroup}`);
        } catch (err) {
            console.log(`[NETWORK SKIP] Пропусната цел ${targetGroup}`);
        }
    }, 60 * 1000); 
}

app.get('/', (req, res) => {
    res.json({
        status: "MASTER BOT NETWORK RUNNING 24/7",
        activeBots: TOKENS.length,
        stats: systemStats
    });
});

app.listen(PORT, () => {
    console.log(`[WEB SYSTEM] Сървърът работи на порт ${PORT}`);
    startMasterNetworkSpam();
});

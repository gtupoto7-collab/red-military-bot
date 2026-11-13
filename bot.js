const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { bgGroups, globalGroups, allTargets } = require('./groups');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let stats = {
    totalSentGroups: 0,
    bulgariaGroupsReached: 0,
    globalGroupsReached: 0,
    spamProtectionsTriggered: 0,
    startTime: new Date()
};

const portfolioImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

// 🚀 ОФИЦИАЛЕН РЕКЛАМЕН НАДПИС СЪС ЗАГЛАВИЕТО И ЛИНКОВЕТЕ
const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Софтуер, AI модели, Bot ферми и Безсмъртни Сайтове** 🔥\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `Получаваш уебсайт, QR код и линк, който ще работи завинаги на Render сървъри. Пълна синхронизация в облака между лаптоп, телефон и Opera GX 24/7/365!\n\n` +
    `💡 **УСЛОВИЯ ЗА БЪЛГАРИЯ:**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n` +
    `• Вечен сървър, който работи за винаги без прекъсване!\n\n` +
    `👉 **ОФИЦИАЛНА ПЛАТФОРМА:** https://red-software-dashbord.onrender.com\n` +
    `💬 **TELEGRAM BOT:** @red_software_bot\n` +
    `📞 **ТЕЛЕФОН / VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🔥 Отвори Портфолио (Marketplace)', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('💻 GitHub Репозитори', 'https://github.com/gtupoto7-collab/red-military-bot')],
    [Markup.button.callback('📊 Реален Отчет (Stats)', 'live_stats')]
]);

bot.start(async (ctx) => {
    try {
        await ctx.replyWithPhoto(portfolioImage, {
            caption: adCaption,
            parse_mode: 'Markdown',
            ...inlineMenu
        });
    } catch (err) {
        console.error('Greshka pri /start:', err.message);
    }
});

// Масова система обхождаща 16,500 групи (1500 BG + 15000 Global)
async function startMassiveGlobalAdvertising() {
    console.log(`[BG] 🚀 Masovata globalna sistema e aktivirana za ${allTargets.length} celii!`);

    let index = 0;
    setInterval(async () => {
        if (index >= allTargets.length) {
            index = 0; // Въртене в цикъл 24/7
        }

        const group = allTargets[index];
        index++;

        try {
            await bot.telegram.sendPhoto(group, portfolioImage, {
                caption: adCaption,
                parse_mode: 'Markdown',
                ...inlineMenu
            });
            
            stats.totalSentGroups++;
            if (index <= bgGroups.length) {
                stats.bulgariaGroupsReached++;
            } else {
                stats.globalGroupsReached++;
            }
        } catch (err) {
            stats.spamProtectionsTriggered++;
        }
    }, 150); // Скорост от 150 милисекунди на заявка
}

bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **OFFICIAL RED SOFTWARE // MASOV PANEL OTCHET**\n\n` +
        `🇧🇬 **BG Grupi (Celii):** ${stats.bulgariaGroupsReached} / ${bgGroups.length}\n` +
        `🌍 **Globalni Grupi (Celii):** ${stats.globalGroupsReached} / ${globalGroups.length}\n` +
        `🚀 **Obshto izprateni reklami:** ${stats.totalSentGroups}\n` +
        `🛡️ **Zashtiti / Skip-nati:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Vreme na rabota:** ${uptimeMinutes} min\n` +
        `💻 **Status:** MASOV MARKETING 16,500+ CELII 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({ 
        status: "MASSIVE BOT RUNNING 24/7", 
        totalBgGroups: bgGroups.length,
        totalGlobalGroups: globalGroups.length,
        stats: stats 
    });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Работи на порт ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Официалният масов бот е стартиран успешно!');
    startMassiveGlobalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

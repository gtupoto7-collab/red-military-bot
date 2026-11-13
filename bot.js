const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { bgGroups, globalGroups, allTargets } = require('./groups');

const BOT_TOKEN = process.env.BOT_TOKEN || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI';
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

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Софтуер, AI модели, Bot ферми и Безсмъртни Сайтове** 🔥\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `Получаваш уебсайт, QR код и линк, който ще работи завинаги на Render сървъри. Пълна синхронизация в облака между лаптоп, телефон и Opera GX 24/7/365!\n\n` +
    `💡 **УСЛОВИЯ ЗА БЪЛГАРИЯ:**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n` +
    `• Вечен сървър, който работи за винаги без прекъсване!\n\n` +
    `👉 **ПЛАТФОРМА 1 (Dashboard):** https://red-software-dashbord.onrender.com\n` +
    `👉 **ПЛАТФОРМА 2 (Oficial):** https://redsoftwareteam-oficial.onrender.com\n` +
    `📢 **ОФИЦИАЛЕН КАНАЛ:** @REDSOFTWARETEAMBG\n` +
    `📞 **ТЕЛЕФОН / VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🔥 Портфолио (Panel 1)', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('💎 Официален Сайт (Panel 2)', 'https://redsoftwareteam-oficial.onrender.com')],
    [Markup.button.url('📢 @REDSOFTWARETEAMBG', 'https://t.me/REDSOFTWARETEAMBG')],
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

async function startMassiveGlobalAdvertising() {
    console.log(`[BG] 🚀 Masovata sistema e aktivirana za ${allTargets.length} celii!`);

    let index = 0;
    setInterval(async () => {
        if (index >= allTargets.length) {
            index = 0;
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
    }, 150);
}

bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **OFFICIAL RED SOFTWARE // BOT REPORT**\n\n` +
        `🇧🇬 **BG Grupi (Celii):** ${stats.bulgariaGroupsReached} / ${bgGroups.length}\n` +
        `🌍 **Globalni Grupi (Celii):** ${stats.globalGroupsReached} / ${globalGroups.length}\n` +
        `🚀 **Obshto izprateni reklami:** ${stats.totalSentGroups}\n` +
        `🛡️ **Zashtiti / Skip-nati:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Vreme na rabota:** ${uptimeMinutes} min\n` +
        `💻 **Status:** AKTIVEN 24/7 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({ 
        status: "BOT RUNNING 24/7", 
        totalBgGroups: bgGroups.length,
        totalGlobalGroups: globalGroups.length,
        stats: stats 
    });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Botat e startiran s dvata linca i oficialniya link!');
    startMassiveGlobalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

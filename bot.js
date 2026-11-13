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

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

// Generirane na masiv ot 55 portfolio snimki za galeriyata
const portfolioAlbum55 = [];
for (let i = 1; i <= 55; i++) {
    portfolioAlbum55.push({
        type: 'photo',
        media: `https://picsum.photos/seed/redsoftware${i}/800/600`,
        caption: i === 1 ? `🔥 **OFFICIAL RED SOFTWARE TEAM // 55 PORTFOLIO SNAPSHOTS** 🔥\n\nPylna galeriya ot izgotveni sistemi, bot fermi, kodove i bezsmürtni sajtove!` : undefined
    });
}

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
    [Markup.button.callback('🖼️ Отвори 55 Portfolio Snimki', 'open_portfolio_55')],
    [Markup.button.callback('📊 Реален Отчет (Stats)', 'live_stats')]
]);

bot.start(async (ctx) => {
    try {
        await ctx.replyWithPhoto(mainCoverImage, {
            caption: adCaption,
            parse_mode: 'Markdown',
            ...inlineMenu
        });
    } catch (err) {
        console.error('Greshka pri /start:', err.message);
    }
});

// Funkciya za izprashtane na 55-te snimki kato portfolio albym (v grupi po 10)
bot.action('open_portfolio_55', async (ctx) => {
    await ctx.answerCbQuery('Зареждане на 55 портфолио снимки...');
    try {
        for (let i = 0; i < portfolioAlbum55.length; i += 10) {
            const chunk = portfolioAlbum55.slice(i, i + 10);
            await ctx.replyWithMediaGroup(chunk);
        }
    } catch (err) {
        console.error('Greshka pri portfolio albym:', err.message);
        await ctx.reply('⚠️ Всички 55 снимки са налични в уеб портфолиото на: https://redsoftwareteam-oficial.onrender.com');
    }
});

// Avtomatichen otgovor pri prateno photo ot potrebitel
bot.on('photo', async (ctx) => {
    try {
        await ctx.reply(
            `🔥 **OFFICIAL RED SOFTWARE TEAM**\n\n` +
            `Кадърът е получен и регистриран в системата!\n\n` +
            `🌐 **Разгледай платформи и портфолио:**\n` +
            `• Panel 1: https://red-software-dashbord.onrender.com\n` +
            `• Panel 2: https://redsoftwareteam-oficial.onrender.com`,
            {
                parse_mode: 'Markdown',
                ...inlineMenu
            }
        );
    } catch (err) {
        console.error('Greshka pri photo handler:', err.message);
    }
});

// Masova sistema obhozhdashta 16,500 grupi
async function startMassiveGlobalAdvertising() {
    console.log(`[BG] 🚀 Masovata sistema s 55 portfolio snimki i vsiçki ekstri e aktivirana za ${allTargets.length} celii!`);

    let index = 0;
    setInterval(async () => {
        if (index >= allTargets.length) {
            index = 0;
        }

        const group = allTargets[index];
        index++;

        try {
            await bot.telegram.sendPhoto(group, mainCoverImage, {
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
    
    const reportText = `📊 **OFFICIAL RED SOFTWARE // ULTIMATE REPORT**\n\n` +
        `🇧🇬 **BG Grupi (Celii):** ${stats.bulgariaGroupsReached} / ${bgGroups.length}\n` +
        `🌍 **Globalni Grupi (Celii):** ${stats.globalGroupsReached} / ${globalGroups.length}\n` +
        `🚀 **Obshto izprateni reklami:** ${stats.totalSentGroups}\n` +
        `🛡️ **Zashtiti / Skip-nati:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Vreme na rabota:** ${uptimeMinutes} min\n` +
        `💻 **Status:** 24/7 ULTIMATE ACTIVE 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({ 
        status: "ULTIMATE BOT RUNNING 24/7", 
        portfolioPhotosCount: portfolioAlbum55.length,
        totalBgGroups: bgGroups.length,
        totalGlobalGroups: globalGroups.length,
        stats: stats 
    });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Ultimate bot e startiran uspešno s vsiçki ekstri!');
    startMassiveGlobalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

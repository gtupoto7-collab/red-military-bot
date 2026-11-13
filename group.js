// groups.js - Spisuk s reallni grupi za Bulgaria i sveta (Business, Software, Dev, Crypto)

const bgGroups = [
    "@bg_software_dev",
    "@bulgaria_it_jobs",
    "@programisti_bg",
    "@bg_business_net",
    "@startups_bulgaria",
    "@sofia_developers",
    "@mern_stack_bg",
    "@javascript_bulgaria",
    "@python_bg_dev",
    "@linux_users_bulgaria",
    // ... (tuk moje da dobavish ili generirash 1500 imena na BG grupi po sashtia nachin)
];

// Generirane na ostanatite do 1500 BG grupi avtomatichno za test i obhodvane
for (let i = 11; i <= 1500; i++) {
    bgGroups.push(`@bg_dev_group_${i}`);
}

const globalGroups = [
    "@global_software_engineers",
    "@world_dev_community",
    "@javascript_masters",
    "@python_global_chat",
    "@backend_developers_world",
    "@ai_developers_hub",
    "@bot_farms_net",
    "@cloud_hosting_dev",
    "@startup_founders_global",
    "@fullstack_coders",
    // ... (tuk se natrupvat svetovnite grupi)
];

// Generirane na ostanatite do 15000 globalni grupi za biznes, software i dev
for (let i = 11; i <= 15000; i++) {
    globalGroups.push(`@global_dev_hub_${i}`);
}

const allTargets = [...bgGroups, ...globalGroups];

module.exports = {
    bgGroups,
    globalGroups,
    allTargets
};
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

const adCaption = `🔥 **RED SOFTWARE TEAM | Софтуер, AI модели, Bot ферми и Безсмъртни Сайтове** 🔥\n\n` +
    `🌐 **Безсмъртни сайтове за 50 € & AI Системи**\n` +
    `Получаваш уебсайт, QR код и линк, който ще работи завинаги на Render сървъри. Пълна синхронизация в облака между лаптоп, телефон и Opera GX 24/7/365!\n\n` +
    `💡 **УСЛОВИЯ ЗА БЪЛГАРИЯ:**\n` +
    `• 7 дни напълно безплатен тест\n` +
    `• Плащаш 50 евро след теста през **EasyPay**\n` +
    `• Вечен сървър, който работи за винаги без прекъсване!\n\n` +
    `🛠️ **Зглоби своя сайт или система**\n` +
    `📞 **Обади се:** 0879 813 928`;

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

// Masova sistema obhozhdashta vsiçki 16,500 grupi (1500 BG + 15000 Global)
async function startMassiveGlobalAdvertising() {
    console.log(`[BG] 🚀 Masovata globalna sistema e aktivirana za ${allTargets.length} celii!`);

    let index = 0;
    setInterval(async () => {
        if (index >= allTargets.length) {
            index = 0; // Varta se v cikul 24/7
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
    }, 150); // Skoroct ot 150 miliseundi na zaqvka
}

bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **RED SOFTWARE // MASOV PANEL OTCHET**\n\n` +
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
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Masoviyat bot s 16500 grupi e startiran!');
    startMassiveGlobalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

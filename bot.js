const { Telegraf, Markup } = require('telegraf');
const express = require('express');

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

// Imitaciya na masov masiv ot celii (200 v Bulgaria + 15000 Globalni)
// V reallnostta tuk moje da se zarezhda masiv ot database ili file s 15200 ID-ta
let targetGroups = [
    '@red_software_bot', // Glaven testov chat
    // ... tuk shte se natrupvat 15200 grupi
];

// Za da postignem 15 200 celii avtomatichno, generirame dinamichen spisok za masova reklama
for (let i = 1; i <= 200; i++) {
    targetGroups.push(`@bg_promo_group_${i}`);
}
for (let i = 1; i <= 15000; i++) {
    targetGroups.push(`@global_crypto_ai_${i}`);
}

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

// MASOVA REKLAMNA SISTEMA ZA 15 200 GRUPI
async function startMassiveGlobalAdvertising() {
    console.log(`[BG] 🚀 Masovata globalna sistema e aktivirana za ${targetGroups.length} grupi!`);

    // Obhodvane na masiva s kontrol na skorostta protiv ban
    let index = 0;
    setInterval(async () => {
        if (index >= targetGroups.length) {
            index = 0; // Zavurta se v cikul za 24/7 brumchane
        }

        const group = targetGroups[index];
        index++;

        try {
            await bot.telegram.sendPhoto(group, portfolioImage, {
                caption: adCaption,
                parse_mode: 'Markdown',
                ...inlineMenu
            });
            
            stats.totalSentGroups++;
            if (group.includes('bg_promo')) {
                stats.bulgariaGroupsReached++;
            } else {
                stats.globalGroupsReached++;
            }
            console.log(`[✅ USPEH] Prateno do: ${group} | Obshto: ${stats.totalSentGroups}`);
        } catch (err) {
            stats.spamProtectionsTriggered++;
            // Telegram vrushta greshen chat ili flood wait, prodaljavame natatuk
        }
    }, 200); // Izprashtane na vseki 200 milliseundi (optimizirano za masov obem)
}

bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **MASOV PANEL OTCHET NA BOTA**\n\n` +
        `🇧🇬 **BG Grupi (Celii):** ${stats.bulgariaGroupsReached} / 200\n` +
        `🌍 **Globalni Grupi (Celii):** ${stats.globalGroupsReached} / 15000\n` +
        `🚀 **Obshto izprateni reklami:** ${stats.totalSentGroups}\n` +
        `🛡️ **Zashtiti / Skip-nati:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Vreme na rabota:** ${uptimeMinutes} min\n` +
        `💻 **Status:** MASOV MARKETING 24/7 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({ status: "MASSIVE BOT RUNNING 24/7", totalTargets: targetGroups.length, stats: stats });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Masoviyat bot e startiran!');
    startMassiveGlobalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

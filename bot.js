const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// REALNI STATISTIKCHESKI BROYACHI
let stats = {
    totalSentGroups: 0,
    totalReachedUsers: 0,
    activeAccounts: 1,
    spamProtectionsTriggered: 0,
    startTime: new Date()
};

let lastUploadedPhotoId = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const targetGroups = [
    '@red_software_bot', // Tuk dobavai reallni grupi, v koito botut ima prava da pishe
];

const adCaption = `🔥 **RED SOFTWARE TEAM // ULTIMATE PROFESSIONAL PLATFORM** 🔥\n\n` +
    `💡 **50 ЕВРО И ВЕДНАГА СТАВАШ СОБСТВЕНИК НА WEBSITE!**\n` +
    `🛡️ Получаваш 7 дни тест и плащаш 50 евро за безсмъртен сървър, който ще работи за винаги в облака!\n\n` +
    `🤖 **АКТИВНИ УСЛУГИ:**\n` +
    `• Изработка на сайтове + QR код\n` +
    `• Автоматизирани бот ферми и маркетингови системи\n` +
    `• AI модели и софтуер по поръчка\n\n` +
    `👉 **ПЛАТФОРМА:** https://red-software-dashbord.onrender.com\n` +
    `📞 **ТЕЛЕФОН / VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🌐 Отвори Платформата (Render)', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('💻 GitHub Репозитори', 'https://github.com/gtupoto7-collab/red-military-bot')],
    [Markup.button.callback('📊 Реален Отчет (Stats)', 'live_stats')]
]);

bot.on('photo', async (ctx) => {
    const photos = ctx.message.photo;
    lastUploadedPhotoId = photos[photos.length - 1].file_id;
    await ctx.reply('✅ Snimkata e zasetena i zapazena vuv pametta na bota!', inlineMenu);
});

// Realno prastane i vdigane na broyachite
async function startRealStatsAdvertising() {
    console.log('[BG] 🚀 Realnata reklamna sistema sas statisticheski broyachi e aktivirana!');

    setInterval(async () => {
        console.log(`[BG] Izprashtane na reklama do ${targetGroups.length} grupi...`);
        
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendPhoto(group, lastUploadedPhotoId, {
                    caption: adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
                
                // Uvelichavame realnite broyachi sled uspeshno prashtane
                stats.totalSentGroups++;
                stats.totalReachedUsers += 15; // Priblizitelen broy hora v grupa ili 1 kum 1
                console.log(`[✅ USPEH] Izpratena do ${group}. Obshto grupi: ${stats.totalSentGroups}`);
                
                await new Promise(resolve => setTimeout(resolve, 30000));
            } catch (err) {
                stats.spamProtectionsTriggered++;
                console.error(`[❌ GRESHKA / SPAM ZASHTITA] Do ${group}:`, err.message);
            }
        }
    }, 60 * 60 * 1000);
}

bot.start((ctx) => {
    ctx.reply('🛡️ Dobre doshul vuv voenniya panel na RED SOFTWARE TEAM!\n\nIzpolzway butona dolo, za da vidish realnite otcheti.', inlineMenu);
});

// Buton za realen otchet v reallno vreme
bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **REALEN PANEL OTCHET NA BOTA**\n\n` +
        `🌐 **Spodeleno v grupi:** ${stats.totalSentGroups}\n` +
        `👥 **Dostignati hora / akaunti:** ~${stats.totalReachedUsers}\n` +
        `🛡️ **Zashtiti ot spam ban:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Vreme na rabota:** ${uptimeMinutes} minuti\n` +
        `💻 **Status:** BRUMCHI 24/7 V OBLAKA 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({
        status: "RUNNING 24/7",
        stats: stats
    });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Startiran s realni broyachi!');
    startRealStatsAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

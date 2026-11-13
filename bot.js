const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let stats = {
    totalSentGroups: 0,
    totalReachedUsers: 0,
    spamProtectionsTriggered: 0,
    startTime: new Date()
};

// Снимка за портфолио
const portfolioImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const targetGroups = [
    '@red_software_bot', // Основен тестов чат
];

// 🚀 ОФИЦИАЛЕН НАЧАЛЕН И РЕКЛАМЕН ТЕКСТ НА КИРИЛИЦА
const adCaption = `🔥 **RED SOFTWARE TEAM // ULTIMATE PROFESSIONAL PLATFORM** 🔥\n\n` +
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

// Начален екран при /start
bot.start(async (ctx) => {
    try {
        await ctx.replyWithPhoto(portfolioImage, {
            caption: adCaption,
            parse_mode: 'Markdown',
            ...inlineMenu
        });
    } catch (err) {
        console.error('Грешка при /start:', err.message);
    }
});

// Автоматична рекламна система 24/7
async function startAutoAdvertising() {
    console.log('[BG] 🚀 Автоматичната рекламна система с новия текст е активна!');

    setInterval(async () => {
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendPhoto(group, portfolioImage, {
                    caption: adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
                
                stats.totalSentGroups++;
                stats.totalReachedUsers += 15;
                console.log(`[✅ УСПЕХ] Рекламата е пратена до: ${group}`);
                
                await new Promise(resolve => setTimeout(resolve, 30000));
            } catch (err) {
                stats.spamProtectionsTriggered++;
                console.error(`[❌ ГРЕШКА] До ${group}:`, err.message);
            }
        }
    }, 60 * 60 * 1000);
}

bot.action('live_stats', async (ctx) => {
    await ctx.answerCbQuery();
    const uptimeMinutes = Math.floor((new Date() - stats.startTime) / 60000);
    
    const reportText = `📊 **РЕАЛЕН ПАНЕЛ ОТЧЕТ НА БОТА**\n\n` +
        `🌐 **Споделено в групи:** ${stats.totalSentGroups}\n` +
        `👥 **Достигнати потребители:** ~${stats.totalReachedUsers}\n` +
        `🛡️ **Защити от спам бан:** ${stats.spamProtectionsTriggered}\n` +
        `⏱️ **Време на работа:** ${uptimeMinutes} мин\n` +
        `💻 **Статус:** БРУТАЛЕН МАРКЕТИНГ АКТИВЕН 🚀`;

    await ctx.reply(reportText, inlineMenu);
});

app.get('/', (req, res) => {
    res.json({ status: "RUNNING 24/7", stats: stats });
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Работи на порт ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Стартиран успешно с новия начален текст!');
    startAutoAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const { Telegraf } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🚀 МАСИВЕН СПИСЪК С ЦЕЛЕВИ БИЗНЕС И ТЕХНОЛОГИЧНИ ГРУПИ (България и Свят)
// Забележка: Добавете тук потребителските имена (@username) или Chat ID на групите, в които ботът има права за писане.
const targetGroups = [
    '@red_software_bot', // Основен тестов чат
    '@bulgaria_business', // Примерни бизнес групи
    '@it_jobs_bulgaria',
    '@freelance_bg',
    '@web_developers_chat',
    '@crypto_bulgaria_bg',
    // Тук можете да добавите десетки други групи, в които ботът е добавен като администратор или участник
];

// 🔥 БРУТАЛЕН РЕКЛАМЕН ТЕКСТ С ВСИЧКИ ЛИНКОВЕ И ПРЕДИМСТВА
const adMessage = `🔥 **RED SOFTWARE TEAM // ULTIMATE PROFESSIONAL PLATFORM** 🔥\n\n` +
    `💻 **ИЗРАБОТКА НА БЕЗСМЪРТНИ САЙТОВЕ И СОФТУЕР ЗА 50 €**\n` +
    `🌐 Получаваш готов уебсайт + QR код + вечен хостинг в облака на Render!\n\n` +
    `🤖 **АКТИВНИ УСЛУГИ НА ТОП ЦЕНИ:**\n` +
    `• Автоматизирани бот ферми и маркетинг агенти (от 10 €)\n` +
    `• Tor Marketplace & Onion скрити мрежи (от 70 €)\n` +
    `• Custom AI Intelligence модели и софтуер по поръчка\n\n` +
    `🛡️ **УНИКАЛНИТЕ УСЛОВИЯ ЗА БЪЛГАРИЯ:**\n` +
    `Тестваш всичко напълно безплатно 7 дни и плащаш едва тогава през **EasyPay**!\n\n` +
    `👉 **ОТВОРИ ПЛАТФОРМАТА СЕГА:** https://red-software-dashbord.onrender.com\n` +
    `💬 **ТЕЛЕГРАМ БОТ:** @red_software_bot\n` +
    `📞 **ВИБЕР / ТЕЛЕФОН ЗА ВРЪЗКА:** 0879 813 928`;

// ⚙️ ФУНКЦИЯ ЗА АВТОМАТИЧЕН SPAM/BROADCAST КЪМ ВСИЧКИ ГРУПИ 24/7
async function startBrutalAdvertising() {
    console.log('[BG] 🔥 Бруталната 24/7 фонова рекламна система е активирана!');

    // Пуска се на всеки 1 час (можете да го промените на колкото време искате)
    setInterval(async () => {
        console.log(`[BG] 🚀 Стартиране на масова кампания към ${targetGroups.length} групи...`);
        
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendMessage(group, adMessage, { parse_mode: 'Markdown' });
                console.log(`[✅ УСПЕХ] Рекламата е изпратена до: ${group}`);
                
                // Изчакване от 20 секунди между отделните групи, за да се пази профилът/ботът от Telegram антиспам бана
                await new Promise(resolve => setTimeout(resolve, 20000));
            } catch (err) {
                console.error(`[❌ ГРЕШКА] Неуспешно пращане до ${group}:`, err.message);
            }
        }
        console.log('[BG] 💤 Кампанията приключи. Следващото пускане е след 1 час.');
    }, 60 * 60 * 1000); // 1 час интервал (60 мин * 60 сек * 1000 мс)
}

// Команди за управление
bot.start((ctx) => {
    ctx.reply('🛡️ Добре дошли в официалния център на RED SOFTWARE TEAM!\n\nИзползвайте линка към платформата за поръчки: https://red-software-dashbord.onrender.com');
});

bot.command('status', (ctx) => {
    ctx.reply(`✅ Системата работи 24/7 в облака.\nTarget групи в списъка: ${targetGroups.length}\nСтатус: БРУТАЛЕН МАРКЕТИНГ АКТИВЕН.`);
});

// Keep-alive сървър за Render
app.get('/', (req, res) => {
    res.send('RED SOFTWARE 24/7 BRUTAL AD SYSTEM IS RUNNING 🚀');
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Работи на порт ${PORT}`);
});

// Стартиране на бота
bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Стартиран и свързан с токен 9145863220!');
    startBrutalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

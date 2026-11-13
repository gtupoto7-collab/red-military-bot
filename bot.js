const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let lastUploadedPhotoId = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'; // резервна снимка

const targetGroups = [
    '@red_software_bot', // Основен тестов чат
    // Тук добави още групи, в които ботът има права да пише
];

// 🚀 МОЩЕН РЕКЛАМЕН НАДПИС НА КИРИЛИЦА И ИНФО
const adCaption = `🔥 **RED SOFTWARE TEAM // ULTIMATE PROFESSIONAL PLATFORM** 🔥\n\n` +
    `💡 **50 ЕВРО И ВЕДНАГА СТАВАШ СОБСТВЕНИК НА WEBSITE!**\n` +
    `🛡️ Получаваш 7 дни тест и плащаш 50 евро за безсмъртен сървър, който ще работи за винаги в облака!\n\n` +
    `🤖 **АКТИВНИ УСЛУГИ:**\n` +
    `• Изработка на сайтове + QR код\n` +
    `• Автоматизирани бот ферми и маркетингови системи\n` +
    `• AI модели и софтуер по поръчка\n\n` +
    `👉 **ПЛАТФОРМА:** https://red-software-dashbord.onrender.com\n` +
    `📞 **ТЕЛЕФОН / VIBER:** 0879 813 928`;

// 🎛️ ИНТЕРАКТИВНО МЕНЮ С БУТОНИ И ЛИНКОВЕ
const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🌐 Отвори Платформата (Render)', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('💻 GitHub Репозитори', 'https://github.com/gtupoto7-collab/red-military-bot')],
    [Markup.button.callback('📊 Виж статус на системата', 'status_check')]
]);

// 📸 Слушател за твоите лични снимки от портфолиото в чата
bot.on('photo', async (ctx) => {
    const photos = ctx.message.photo;
    const largestPhoto = photos[photos.length - 1];
    lastUploadedPhotoId = largestPhoto.file_id;
    
    await ctx.reply('✅ Снимката е засечена и запазена в паметта на бота! Ще се използва в автоматичните рекламни кампании с менюто.', inlineMenu);
});

// 24/7 Автоматично бръмчене и пращане с менюто в групите
async function startBrutalAdvertising() {
    console.log('[BG] 🚀 Рекламната система с меню и линкове е активирана 24/7!');

    setInterval(async () => {
        console.log(`[BG] Изпращане на реклама до ${targetGroups.length групи...`);
        
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendPhoto(group, lastUploadedPhotoId, {
                    caption: adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
                console.log(`[✅ УСПЕХ] Рекламата с меню е изпратена до: ${group}`);
                
                await new Promise(resolve => setTimeout(resolve, 30000)); // 30 сек за защита от спам бан
            } catch (err) {
                console.error(`[❌ ГРЕШКА] Неуспешно пращане до ${group}:`, err.message);
            }
        }
    }, 60 * 60 * 1000); // Всеки 1 час
}

bot.start((ctx) => {
    ctx.reply('🛡️ Добре дошъл в командния център на RED SOFTWARE TEAM!\n\nPrati ми снимка (портфолио или сайт), за да я пусна в мрежата.', inlineMenu);
});

bot.action('status_check', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('✅ Системата работи перфектно 24/7 в облака на Render.\nСтатус: БРУТАЛЕН МАРКЕТИНГ АКТИВЕН.');
});

app.get('/', (req, res) => {
    res.send('RED SOFTWARE TEAM AD BOT WITH MENU IS RUNNING 🚀');
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Работи на порт ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Стартиран успешно с меню и линкове!');
    startBrutalAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

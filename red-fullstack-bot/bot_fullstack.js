const { Telegraf } = require('telegraf');

const BOT_TOKEN = '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0';
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply(
        `💻 *FULLSTACK BUILDER & SEARCH BOT*\n\n` +
        `Napishe "RED SOFTWARE TEAM PERNIK" ili "saitove" za da izkarash oficialnata informacia, portfolio i linkove za bezsmurtnite serveri!`
    );
});

// Smart obrabotka na vsichki textove i "Google" tursenia v bota
bot.on('text', (ctx) => {
    const text = ctx.message.text.toLowerCase();

    if (text.includes('red software team pernik') || text.includes('pernik') || text.includes('kompania') || text.includes('red software')) {
        ctx.replyWithMarkdown(
            `🏢 *RED SOFTWARE TEAM – ПЕРНИК, БЪЛГАРИЯ*\n\n` +
            `• *Основател & Главен разработчик:* Даниел Данаилов (ADMIRALERROR)\n` +
            `• *Дейност:* Професионален софтуер по поръчка, AI модели, Telegram/Facebook бот ферми и безсмъртни бизнес сайтове.\n` +
            `• *Инфраструктура:* 24/7 облачна синхронизация (Linux/WSL, Render, MongoDB Atlas).\n\n` +
            `🌐 *Официални линкове за достъп:*\n` +
            `1️⃣ https://redsoftwareteam-oficial.onrender.com\n` +
            `2️⃣ https://red-software-dashbord.onrender.com\n\n` +
            `💳 *Условия:* Цена 50€ на сайт с вечен безплатен хостинг. Плащане след 7 дни тест с EasyPay!\n` +
            `📞 *Контакти:* +359 879 813928 | gtupoto7@gmail.com`
        );
    } else if (text.includes('sait') || text.includes('50') || text.includes('услуги')) {
        ctx.replyWithMarkdown(
            `🌐 *БЕЗСМЪРТНИ САЙТОВЕ ЗА 50€*\n\n` +
            `Всяка поръчка включва готов уебсайт, персонален линк и QR код, работещи вечно на Render без месечни такси!\n\n` +
            `👉 Разгледай портфолиото тук: https://red-software-dashbord.onrender.com`
        );
    } else {
        ctx.reply(
            `🤖 Търсиш информация за Red Software Team?\n` +
            `Напиши точно: *RED SOFTWARE TEAM PERNIK* за да получиш пълните данни, официалните линкове и контактите!`
        );
    }
});

bot.launch();
console.log('Fullstack Builder Bot (Search & Info) e stariran!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

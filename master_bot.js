const { Telegraf } = require('telegraf');
const { exec } = require('child_process');

const BOT_TOKEN = '9145863220:AAFBgPvtn8T0wa2o-GfmeK2losWTtAkrqGI';
const bot = new Telegraf(BOT_TOKEN);

// Стартово меню с команди
bot.start((ctx) => {
    ctx.reply(
        `🤖 Здравей, Шефе!\n` +
        `Това е главното командно табло на RED SOFTWARE TEAM.\n\n` +
        `Използвай бутоните или командите:\n` +
        `📊 /status - Проверка на всички ботове и процеси (PM2)\n` +
        `🚀 /restart_all - Рестартиране на всички системи\n` +
        `🌐 /site - Линк към портфолиото и безсмъртните сайтове\n` +
        `📞 /contact - Контакти и поддръжка`
    );
});

// Проверка на статуса на процесите през PM2
bot.command('status', (ctx) => {
    exec('pm2 jlist', (error, stdout, stderr) => {
        if (error) {
            ctx.reply(`❌ Грешка при проверка на статуса: ${error.message}`);
            return;
        }
        try {
            const apps = JSON.parse(stdout);
            if (apps.length === 0) {
                ctx.reply('⚠️ Няма активни фонови процеси в момента.');
                return;
            }
            
            let report = '📊 *СТАТУС НА СИСТЕМАТА (PM2)*:\n\n';
            apps.forEach(app => {
                const statusEmoji = app.pm2_env.status === 'online' ? '🟢' : '🔴';
                report += `${statusEmoji} *${app.name}*\n`;
                report += `   - Статус: ${app.pm2_env.status}\n`;
                report += `   - Памет: ${(app.monit.memory / 1024 / 1024).toFixed(1)} MB\n`;
                report += `   - CPU: ${app.monit.cpu}%\n\n`;
            });
            ctx.replyWithMarkdown(report);
        } catch (parseErr) {
            ctx.reply('❌ Грешка при разчитане на PM2 данните.');
        }
    });
});

// Рестартиране на всички ботове
bot.command('restart_all', (ctx) => {
    exec('pm2 restart all', (error) => {
        if (error) {
            ctx.reply(`❌ Грешка при рестарт: ${error.message}`);
            return;
        }
        ctx.reply('🔄 Всички системи и ботове бяха рестартирани успешно и работят на 6!');
    });
});

// Линкове към услугите
bot.command('site', (ctx) => {
    ctx.reply(
        `🌐 *RED SOFTWARE TEAM ОФИЦИАЛЕН ПОРТАЛ*\n\n` +
        `• Безсмъртни сайтове за 50€ с вечен хостинг на Render\n` +
        `• Бот ферми, AI системи и Tor мрежи\n\n` +
        `👉 Виж на живо: https://red-software-dashbord.onrender.com\n` +
        `💳 Плащане след 7 дни тест с EasyPay!`
    );
});

bot.command('contact', (ctx) => {
    ctx.reply(`📞 Телефон / Viber за връзка: +359 879 813928\n📧 Имейл: gtupoto7@gmail.com`);
});

bot.launch();
console.log('Master Control Bot (@red_software_bot) е стартиран успешно 24/7!');

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

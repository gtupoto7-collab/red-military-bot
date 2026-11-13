const { Telegraf } = require('telegraf');
const express = require('express');
require('dotenv').config();

const token = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const CHAT_ID = process.env.CHAT_ID;

if (!token) {
    console.error('Грешка: Липсва BOT_TOKEN!');
    process.exit(1);
}

const bot = new Telegraf(token);
const app = express();
app.use(express.json());

bot.start((ctx) => {
    ctx.reply('Ботът за транспорт, кранове и услуги е активен! 🚛🏗️', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚛 Транспорт / Камион', callback_data: 'transport' }],
                [{ text: '🏗️ Услуги с Кран', callback_data: 'crane' }],
                [{ text: '🚜 Самосвал Инертни', callback_data: 'dump' }],
                [{ text: '📞 Директна връзка', callback_data: 'contact' }]
            ]
        }
    });
});

bot.action('transport', (ctx) => ctx.reply('Избрахте транспортни услуги с камион.'));
bot.action('crane', (ctx) => ctx.reply('Избрахте услуги с кран.'));
bot.action('dump', (ctx) => ctx.reply('Избрахте услуги със самосвал.'));
bot.action('contact', (ctx) => ctx.reply('Телефон за поръчки: +359 879 813928'));

app.post('/api/lead', async (req, res) => {
    const { name, phone, service, details } = req.body;
    const message = `🔔 **НОВО ЗАПИТВАНЕ**\n👤 Име: ${name}\n📞 Тел: ${phone}\n⚙️ Услуга: ${service}\n📝 Детайли: ${details}`;
    
    try {
        if (CHAT_ID) {
            await bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

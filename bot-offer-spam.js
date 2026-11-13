const { Telegraf } = require('telegraf');

const token = '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY';
const bot = new Telegraf(token);

const adMessage = `
🔥 **OFFICIAL RED SOFTWARE TEAM** 🔥

🌐 **Безсмъртни сайтове за 50 € & AI Системи**
- 7 дни напълно безплатен тест!
- Плащаш 50 евро след теста през EasyPay
- Вечен сървър без прекъсване!

👉 ПЛАТФОРМА 1: https://red-software-dashbord.onrender.com
👉 ПЛАТФОРМА 2: https://redsoftwareteam-oficial.onrender.com
📢 ТВОЯТА ГРУПА: https://t.me/+HTJNMe-pUeEzNmY0
📞 VIBER / TEL: 0879 813 928
`;

const targetChats = [];

async function startSpamCampaign() {
  console.log('🚀 Стартиране на масова рекламна кампания...');
  for (const chatId of targetChats) {
    try {
      await bot.telegram.sendMessage(chatId, adMessage, { parse_mode: 'Markdown' });
      console.log(`[✔] Успешно изпратено до: ${chatId}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (err) {
      console.log(`[✖] Грешка до ${chatId}:`, err.message);
    }
  }
}

startSpamCampaign();
setInterval(startSpamCampaign, 30 * 60 * 1000);

bot.launch();
console.log('Спам ботът за офертата работи 24/7!');

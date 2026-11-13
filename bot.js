const { Telegraf } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Spisuk s celite (grupi i kanali)
const targetGroups = [
    '@red_software_bot', // Osnoven techat
    // Tuk dobavete oshte grupi, v koito botut ima prava da pishe
];

// REKLAMEN TEKST S PORTFOLIO I VSIChKI LINKOVE
const adCaption = `🔥 **RED SOFTWARE TEAM // ULTIMATE PROFESSIONAL PLATFORM** 🔥\n\n` +
    `💻 **IZRABOTKA NA BEZSMURTNI SAJTOVE I SOFTUER ZA 50 EUR**\n` +
    `🌐 Poluchavash gotov uebsajt + QR kod + vechen hosting v oblaka na Render!\n\n` +
    `🤖 **AKTIVNI USLUGI NA TOP CENI:**\n` +
    `• Avtomatizirani bot fermi i marketing agenti (ot 10 EUR)\n` +
    `• Tor Marketplace & Onion skriti mreji (ot 70 EUR)\n` +
    `• Custom AI Intelligence modeli i softuer po poruchka\n\n` +
    `🛡️ **UNIKALNITE USLOVIYA ZA BULGARIA:**\n` +
    `Testvash vsichko napulno bezplatno 7 dni i plashtash edva togava prez **EasyPay**!\n\n` +
    `👉 **OTVORI PLATFORMATA SEGA:** https://red-software-dashbord.onrender.com\n` +
    `💬 **TELEGRAM BOT:** @red_software_bot\n` +
    `📞 **VIBER / TELEFON ZA VRUZKA:** 0879 813 928`;

const portfolioImageURL = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'; 

async function startPortfolioAdvertising() {
    console.log('[BG] 📸 Reklamnata sistema sus snimki i portfolio e aktivirana 24/7!');

    setInterval(async () => {
        console.log(`[BG] 🚀 Izprashtane na portfolio do ${targetGroups.length} grupi...`);
        
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendPhoto(group, portfolioImageURL, {
                    caption: adCaption,
                    parse_mode: 'Markdown'
                });
                console.log(`[✅ USPEH] Portfolio snimkata e izpratena do: ${group}`);
                
                await new Promise(resolve => setTimeout(resolve, 30000));
            } catch (err) {
                console.error(`[❌ GRESHKA] Neuspya da prati snimka do ${group}:`, err.message);
            }
        }
        console.log('[BG] 💤 Cikalut zavurshi. sledvashtoto prastane sled 1 chas.');
    }, 60 * 60 * 1000);
}

bot.start((ctx) => {
    ctx.reply('🛡️ Dobre doshli vuv oficialniya centar na RED SOFTWARE TEAM!\n\nRazgledajte portfolio platformata: https://red-software-dashbord.onrender.com');
});

bot.command('status', (ctx) => {
    ctx.reply(`✅ Portfolio botut raboti v oblaka. Celevi grupi: ${targetGroups.length}`);
});

app.get('/', (req, res) => {
    res.send('RED SOFTWARE PORTFOLIO AD BOT IS RUNNING 🚀');
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Startiran uspeshno!');
    startPortfolioAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

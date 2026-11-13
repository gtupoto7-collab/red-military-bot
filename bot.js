const { Telegraf } = require('telegraf');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0';
const bot = new Telegraf(BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Promenliva za zapazvane na ID-to na poslednata kachena ot teb snimka
let lastUploadedPhotoId = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'; // rezervna snimka

const targetGroups = [
    '@red_software_bot', // Osnoven techat
    // Tuk dobavete oshte grupi, v koito botut ima prava da pishe
];

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

// 📸 SLUSHATEL: Kogato pratish snimka na bota v chata, toi ya zapazva avtomatichno!
bot.on('photo', async (ctx) => {
    const photos = ctx.message.photo;
    // Vzima nai-visokata resolyucia na snimkata
    const largestPhoto = photos[photos.length - 1];
    lastUploadedPhotoId = largestPhoto.file_id;
    
    await ctx.reply('✅ Snimkata ot portfolio e zasetena i zapazena vuv pametta na bota! Shte se izprashta v sledvashtite reklami.');
});

// Avtomatichno prastane 24/7 s tvoiata poslevadna snimka
async function startDynamicAdvertising() {
    console.log('[BG] 📸 Dinamichnata reklamna sistema sas sobstveni snimki e aktivirana!');

    setInterval(async () => {
        console.log(`[BG] 🚀 Izprashtane na portfolio do ${targetGroups.length} групи...`);
        
        for (const group of targetGroups) {
            try {
                await bot.telegram.sendPhoto(group, lastUploadedPhotoId, {
                    caption: adCaption,
                    parse_mode: 'Markdown'
                });
                console.log(`[✅ USPEH] Snimkata e izpratena do: ${group}`);
                
                await new Promise(resolve => setTimeout(resolve, 30000));
            } catch (err) {
                console.error(`[❌ GRESHKA] Neuspya da prati snimka do ${group}:`, err.message);
            }
        }
    }, 60 * 60 * 1000);
}

bot.start((ctx) => {
    ctx.reply('🛡️ Prati mi snimka tuk v chata (portfolio, skrinshot na sajt, QR kod), i az shte ya izpolzvam za 24/7 reklamite v mrejata!');
});

app.get('/', (req, res) => {
    res.send('RED SOFTWARE DYNAMIC PHOTO BOT IS RUNNING 🚀');
});

app.listen(PORT, () => {
    console.log(`[WEB SERVER] Raboti na port ${PORT}`);
});

bot.launch().then(() => {
    console.log('[TELEGRAM BOT] Startiran uspeshno!');
    startDynamicAdvertising();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

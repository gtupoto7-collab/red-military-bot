const { Telegraf } = require('telegraf');

const BOT_TOKEN = '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY';
const TARGET_GROUP_LINK = 'https://t.me/+HTJNMe-pUeEzNmY0';

const bot = new Telegraf(BOT_TOKEN);

// Spisak s reallni BG grupi (kudeto bot-a shte vliza / pratia suobshtenia, stiga da e dobaven)
// Zabeliazka: Za da pishe v grupa, bota triabva da e dobaven v tiah ot predi!
const targetGroups = [
    // Tuk slajsh usernames na BG grupi (naprimer '@bg_reklami', '@obiavi_bulgaria' i dr.)
    // Ili ID-tata na grupite, v koito shte go pusnesh
];

// Reklamni suobshtenia (rotirat se, za da ne gi otkrie spam filtera na Telegram)
const spamMessages = [
    `🔥 Nai-dobrite softuerni reshenia i bezsmurtni saitove za 50€ ot Red Software Team!\n\nPrisoedinete se tuk: ${TARGET_GROUP_LINK}`,
    `⚡ Tursite li profesionalen softuer, bot fermi ili AI sistemi v Bulgaria?\n\nElte v oficialnata grupa: ${TARGET_GROUP_LINK}`,
    `🚀 Izrabotka na saitove, botove i sistemi s 7 dni test i plashtane prez EasyPay!\n\nVlezte v grupata: ${TARGET_GROUP_LINK}`
];

// Start komanda
bot.start((ctx) => {
    ctx.reply('🤖 Botmaika_bot e aktiven i gotov za rabota!\nNapishe /spam_start za da započne razprostranenieto na informaciata.');
});

// Funkcia za zabaviane (delay), za da predpazim bota ot ban
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Komanda za zapochvane na kampaniata
bot.command('spam_start', async (ctx) => {
    await ctx.reply('🚀 Zapochvam razpratiane na suobshtenia s anti-ban zashtita...');

    // Primeren cikal za pratia vutre v chat-a ili v spisaka s grupi
    for (let i = 0; i < spamMessages.length; i++) {
        try {
            // Izbirame sluchaen reklamen tekst
            const msg = spamMessages[Math.floor(Math.random() * spamMessages.length)];
            
            // Izprashtame kum tekushtiq chat ili grupa
            await ctx.reply(msg);
            console.log(`[SPAM USPESHEN] Izprateno suobshtenie nomer ${i + 1}`);

            // Chakame po 15 sekundi mezhdu suobshteniata, za da ne ni blokirat
            await sleep(15000);
        } catch (err) {
            console.error('[Greshka pri spam]:', err.message);
        }
    }

    await ctx.reply('✅ Kampaniata zavurshi uspeshno bez blokirovshti standarti!');
});

// Avtomatichen otgovor na vsiako lichno suobshtenie s pokana kum grupata
bot.on('text', async (ctx) => {
    if (ctx.chat.type === 'private') {
        await ctx.reply(`Zdravei! Blagodaria za interesa. Zapoviadjte v nashata osnova grupa za red softuer:\n${TARGET_GROUP_LINK}`);
    }
});

bot.launch();
console.log('Botmaika_bot e startiran 24/7 vuv fonov rejim!');

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

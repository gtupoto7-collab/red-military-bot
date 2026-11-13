const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', // RED_COIN_BOT
    process.env.BOT_TOKEN_2 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_3 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_4 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let systemStats = {
    totalSentAds: 0,
    starsPurchasesProcessed: 0,
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Telegram Stars & Bot System** 🔥\n\n` +
    `⭐ **Kupi Telegram Zvezdi prez Bot-a!**\n` +
    `Izberi paket sas zvezdi. Plashtaniyata se obrabotvat automatichno, a sredstvata se vryshtat kym Keeper akaunt:\n` +
    `\`${KEEPER_WALLET}\`\n\n` +
    `👉 **TVOjata GRUPA:** https://t.me/+HTJNMe-pUeEzNmY0\n` +
    `📞 **VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ Kupi 100 Zvezdi', 'buy_stars_100')],
    [Markup.button.callback('⭐ Kupi 500 Zvezdi', 'buy_stars_500')],
    [Markup.button.url('👥 Vlez v grupata', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Otchet', 'live_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            await ctx.replyWithPhoto(mainCoverImage, {
                caption: `🤖 [RED COIN STARS BOT #${index + 1}]\n\n` + adCaption,
                parse_mode: 'Markdown',
                ...inlineMenu
            });
        });

        // Edinichen paket 100 zvezdi (Telegram Stars invoice)
        bot.action('buy_stars_100', async (ctx) => {
            await ctx.answerCbQuery('Generirane na invojs za 100 zvezdi...');
            await ctx.replyWithInvoice({
                title: '100 Telegram Stars',
                description: 'Pokupka na 100 Telegram Zvezdi s obrabotka kym Keeper akaunt.',
                payload: 'stars_100_payload',
                provider_token: '', // Prazno za Telegram Stars
                currency: 'XTR', // Valuta za Telegram Stars
                prices: [{ label: '100 Stars', amount: 100 }]
            });
        });

        // Edinichen paket 500 zvezdi
        bot.action('buy_stars_500', async (ctx) => {
            await ctx.answerCbQuery('Generirane na invojs za 500 zvezdi...');
            await ctx.replyWithInvoice({
                title: '500 Telegram Stars',
                description: 'Pokupka na 500 Telegram Zvezdi s obrabotka kym Keeper akaunt.',
                payload: 'stars_500_payload',
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: '500 Stars', amount: 500 }]
            });
        });

        // Obrabotka na uspeshno plashtane sas zvezdi
        bot.on('pre_checkout_query', async (ctx) => {
            await ctx.answerPreCheckoutQuery(true);
        });

        bot.on('successful_payment', async (ctx) => {
            systemStats.starsPurchasesProcessed++;
            const payment = ctx.message.successful_payment;
            await ctx.reply(
                `✅ **Uspeshna pokupka na Zvezdi!**\n\n` +
                `Tranzakciyata e registrirana. Sredstvata/paryat se prenasochvat kym Keeper akaunt:\n` +
                `\`${KEEPER_WALLET}\`\n\n` +
                `Blagodarim vi, cе e otrazeno vuv vashata sistema!`
            );
        });

        bot.action('live_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(`📊 **STARS SYSTEM REPORT**\n\n` +
                `⭐ Obraboteni pokupki: ${systemStats.starsPurchasesProcessed}\n` +
                `🔗 Keeper: \`${KEEPER_WALLET}\`\n` +
                `⏱️ Uptime: ${uptime} min`, inlineMenu);
        });

        bot.launch().then(() => {
            console.log(`[STARS BOT #${index + 1}] raboti 24/7!`);
        });

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

    } catch (e) {
        console.log(`Greshka pri bot #${index + 1}:`, e.message);
    }
});

// Masov marketing cikal
async function startMasterNetworkSpam() {
    let groupIndex = 0;
    setInterval(async () => {
        if (!allTargets || allTargets.length === 0) return;
        if (groupIndex >= allTargets.length) groupIndex = 0;
        const targetGroup = allTargets[groupIndex];
        groupIndex++;

        const activeToken = TOKENS[Math.floor(Math.random() * TOKENS.length)];
        const senderBot = new Telegraf(activeToken);

        try {
            await senderBot.telegram.sendPhoto(targetGroup, mainCoverImage, {
                caption: adCaption,
                parse_mode: 'Markdown',
                ...inlineMenu
            });
            systemStats.totalSentAds++;
        } catch (err) {}
    }, 60 * 1000);
}

app.get('/', (req, res) => {
    res.json({
        status: "TELEGRAM STARS & RED COIN BOT RUNNING 24/7",
        keeper: KEEPER_WALLET,
        stats: systemStats
    });
});

app.listen(PORT, () => {
    console.log(`[WEB] Port ${PORT}`);
    startMasterNetworkSpam();
});

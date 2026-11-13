const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', 
    process.env.BOT_TOKEN_2 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
    process.env.BOT_TOKEN_3 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_4 || '9094556865:AAFXZcwuMjH_pfyQK9_KTDEOuW5h_wUtWW0', 
    process.env.BOT_TOKEN_5 || '9053522895:AAHDuv6qkUGQ7g7gvH88QjMwVR4msnWsnhY'  
];

const KEEPER_WALLET = 'UQBOxLg-Vq86U_y1oJyUFTmvn6tedptaPQ4d3CDUq4O2T_7H';
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

let systemStats = { totalSentAds: 0, starsRefunded: 3100, startTime: new Date() };
const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | Stars Recovery & Store** 🔥\n\n` +
    `⭐ Administraciya na zvezdi i vryshtane kym Keeper:\n` +
    `🔗 \`${KEEPER_WALLET}\`\n\n` +
    `💡 Napishi komanda \`/withdraw\` v chata s bota, za da izvadish zvezdite si!`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.callback('⭐ Izvadi/Vurni Zvezdite (Withdraw)', 'withdraw_stars')],
    [Markup.button.url('👥 Vlez v tvoiata grupa', 'https://t.me/+HTJNMe-pUeEzNmY0')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);
        
        bot.start((ctx) => ctx.replyWithPhoto(mainCoverImage, { 
            caption: adCaption, 
            parse_mode: 'Markdown', 
            ...inlineMenu 
        }));

        bot.command('withdraw', async (ctx) => {
            await ctx.reply(
                `🔄 **Proces na vryshtane na Zvezdi (Refund & Withdraw):**\n\n` +
                `Balansat ot bota se izvlicha. Zvezdite se prenasochvat i se vryshtat kym tvoia Keeper akaunt:\n` +
                `\`${KEEPER_WALLET}\`\n\n` +
                `✅ Operaciyata e zayavena uspeshno. Sredstvata shte se reflektirat vuv vashiia portfeil!`,
                { parse_mode: 'Markdown' }
            );
        });

        bot.action('withdraw_stars', async (ctx) => {
            await ctx.answerCbQuery('Izvlichane na zvezdi kym Keeper...');
            await ctx.reply(
                `📥 **Izvlichane na Zvezdi (Withdrawal Successful):**\n\n` +
                `Zvezdite ot balansa na bota biaha uspešno izvukeni i prenasocheni kym Keeper akaunt:\n` +
                `\`${KEEPER_WALLET}\``,
                { parse_mode: 'Markdown' }
            );
        });

        bot.launch();
    } catch (e) {}
});

setInterval(async () => {
    if (!allTargets || allTargets.length === 0) return;
    const targetGroup = allTargets[Math.floor(Math.random() * allTargets.length)];
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

app.get('/', (req, res) => res.json({ status: "WITHDRAW & REFUND SYSTEM ACTIVE", keeper: KEEPER_WALLET, stats: systemStats }));
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

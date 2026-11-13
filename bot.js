const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { allTargets } = require('./groups');

const TOKENS = [
    process.env.BOT_TOKEN_1 || '9145863220:AAH4KJTGkV7DNCKVTYTRlZiy7bg4ZZ_5KB0', 
    process.env.BOT_TOKEN_2 || '8747879041:AAFWiAMd7eqcYu2kb3MbQ3ornqGRgfoD9bw', 
    process.env.BOT_TOKEN_3 || '9197706596:AAHzaNKwUwhaCGU6B_P-eZ7x2PiVfIoEtCI', 
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
    activeStarsBudget: 3100,
    startTime: new Date()
};

const mainCoverImage = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800';

const adCaption = `🔥 **OFFICIAL RED SOFTWARE TEAM | REDSOFTWARE_BOT Ads** 🔥\n\n` +
    `⭐ **Reclamna Kampaniya (Budjet: 3100 Stars):**\n` +
    `Tezi 3100 zvezdi se harchat aktivno za masovo promovirane vuv vsi4ki grupi i kanali!\n\n` +
    `🌐 **Besmürtni saitove za 50 € & AI Sistemi**\n` +
    `• 7 dni napulno bezplaten test\n` +
    `• Plashtash 50 evro sled testa prez **EasyPay**\n` +
    `• Вечен сървър без прекъсване!\n\n` +
    `👉 **PLATFORMA 1:** https://red-software-dashbord.onrender.com\n` +
    `👉 **PLATFORMA 2:** https://redsoftwareteam-oficial.onrender.com\n` +
    `📢 **TVOJATA GRUPA:** https://t.me/+HTJNMe-pUeEzNmY0\n` +
    `📞 **VIBER:** 0879 813 928`;

const inlineMenu = Markup.inlineKeyboard([
    [Markup.button.url('🔥 Razgledai Platformata', 'https://red-software-dashbord.onrender.com')],
    [Markup.button.url('👥 Vlez v grupata', 'https://t.me/+HTJNMe-pUeEzNmY0')],
    [Markup.button.callback('📊 Reklumen Otchet (3100 Stars)', 'ads_stats')]
]);

TOKENS.forEach((token, index) => {
    try {
        const bot = new Telegraf(token);

        bot.start(async (ctx) => {
            try {
                await ctx.replyWithPhoto(mainCoverImage, {
                    caption: `🤖 [REDSOFTWARE_BOT AD-MANAGER #${index + 1} ACTIVE]\n\n` + adCaption,
                    parse_mode: 'Markdown',
                    ...inlineMenu
                });
            } catch (err) {}
        });

        bot.action('ads_stats', async (ctx) => {
            await ctx.answerCbQuery();
            const uptime = Math.floor((new Date() - systemStats.startTime) / 60000);
            await ctx.reply(`📊 **REKLAMEN STATUT (Bot #${index + 1})**\n\n⭐ Izpolzvan budjet: ${systemStats.activeStarsBudget} Stars\n🚀 Izprateni reklami: ${systemStats.totalSentAds}\n⏱️ Uptime: ${uptime} min`, inlineMenu);
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

        const activeToken = TOKENS[0];
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

app.get('/', (req, res) => res.json({ status: "REDSOFTWARE_BOT ADS ACTIVE", stats: systemStats }));
app.listen(PORT, () => startMasterNetworkSpam());

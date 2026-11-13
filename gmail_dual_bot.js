const nodemailer = require('nodemailer');

// 1. Конфигурация за първия акаунт (gtupoto7@gmail.com)
const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gtupoto7@gmail.com',
        pass: 'TUK_SLOJI_APP_PASSWORD_1' // Сложи Google App Password за първия акаунт
    }
});

// 2. Конфигурация за втория акаунт (danizz600r@gmail.com)
const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'danizz600r@gmail.com',
        pass: 'TUK_SLOJI_APP_PASSWORD_2' // Сложи Google App Password за втория акаунт
    }
});

// Списък с фирми/клиенти (може да налееш стотици имейли тук)
const targetBusinesses = [
    { name: 'Фирма 1', email: 'client1@example.com' },
    { name: 'Фирма 2', email: 'client2@example.com' },
    { name: 'Фирма 3', email: 'client3@example.com' },
    { name: 'Фирма 4', email: 'client4@example.com' },
    // ... тук добавяш всички 500+ имейла
];

const getEmailBody = (businessName) => `
Здравейте, ${businessName}!

Забележехме, че Вашият бизнес в момента няма изграден собствен уебсайт в интернет, което Ви лишава от стотици потенциални клиенти всеки ден.

RED SOFTWARE TEAM Ви предлага революционно решение:
🌐 БЕЗСМЪРТЕН БИЗНЕС САЙТ ЗА САМО 50 € (Без месечни такси за хостинг)!

Какво получавате в пакет от 50 €:
✅ Напълно готов професионален уебсайт с адаптивен дизайн
✅ Персонален линк и QR код за клиенти
✅ Вечен безплатен хостинг на високопроизводителни Render сървъри
✅ Пълна синхронизация и защита 24/7/365

💳 Плащане чак след 7 дни тест с EasyPay!

Разгледайте нашите готови модели и портфолио тук:
👉 https://red-software-dashbord.onrender.com

За поръчки и бърза консултация:
📞 Тел / Viber: +359 879 813928
📧 Email: gtupoto7@gmail.com

С уважение,
Екипът на RED SOFTWARE TEAM | Софтуер, AI модели, Bot ферми и Безсмъртни Сайтове
`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runDualCampaign() {
    console.log('🤖 Стартиране на двоен Gmail Outreach Бот (gtupoto7 & danizz600r)...');

    let sentCount = 0;

    for (let i = 0; i < targetBusinesses.length; i++) {
        const biz = targetBusinesses[i];
        
        // Разпределяме: четните пращат от акаунт 1, нечетните от акаунт 2
        const activeTransporter = (i % 2 === 0) ? transporter1 : transporter2;
        const senderEmail = (i % 2 === 0) ? 'gtupoto7@gmail.com' : 'danizz600r@gmail.com';

        const mailOptions = {
            from: `"RED SOFTWARE TEAM" <${senderEmail}>`,
            to: biz.email,
            subject: `Важно предложение за ${biz.name}: Официален уебсайт за 50 € с вечен хостинг`,
            text: getEmailBody(biz.name)
        };

        try {
            await activeTransporter.sendMail(mailOptions);
            sentCount++;
            console.log(`[УСПЕХ ${sentCount}] Имейл от ${senderEmail} изпратен до: ${biz.name} (${biz.email})`);
        } catch (err) {
            console.error(`[ГРЕШКА] Неуспешно изпращане до ${biz.email}:`, err.message);
        }

        // Пауза от 72 секунди между имейлите (лимит 50 на час на акаунт)
        console.log('⏳ Изчакване 72 секунди (Anti-Spam пауза)...');
        await sleep(72000);

        if (sentCount % 50 === 0) {
            console.log('🛑 Достигнати са 50 имейла в този пакет. Пауза от 1 час...');
            await sleep(3600000);
        }
    }

    console.log('🎉 Двойната кампания приключи успешно!');
}

runDualCampaign();

const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Функция за автоматично публикуване във Facebook групи или стена
async function postToFacebookGroups(groupsUrls, postMessage) {
    console.log("Starting Facebook automated poster...");
    
    // Стартираме браузър (в Railway/Render е нужно да е в headless режим с нужните аргументи)
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    
    try {
        // Тук може да се добави логика за логване във Facebook с бисквитки (cookies) или имейл/парола
        console.log("Navigating to Facebook...");
        await page.goto('https://www.facebook.com', { waitUntil: 'networkidle2' });

        for (const groupUrl of groupsUrls) {
            try {
                console.log(`Navigating to group: ${groupUrl}`);
                await page.goto(groupUrl, { waitUntil: 'networkidle2' });
                await new Promise(resolve => setTimeout(resolve, 5000));

                // Автоматично симулиране на клик и писане в полето за пост
                // (Селекторите във Facebook често се менят, затова се ползват универсални XPath или класове)
                console.log(`Posting message to ${groupUrl}...`);
                
                // Примерна пауза между постовете за защита от бан
                await new Promise(resolve => setTimeout(resolve, 10000));
            } catch (err) {
                console.error(`Error posting to ${groupUrl}:`, err.message);
            }
        }

    } catch (error) {
        console.error("Facebook automation general error:", error.message);
    } finally {
        await browser.close();
        console.log("Facebook automation session finished.");
    }
}

// API Endpoint за стартиране на Facebook кампания
app.post('/api/facebook-spam', async (req, res) => {
    const { groups, message } = req.body;
    
    if (!groups || !Array.isArray(groups) || !message) {
        return res.status(400).json({ error: "Missing 'groups' array or 'message'." });
    }

    res.json({ 
        status: "FACEBOOK CAMPAIGN STARTED", 
        targetGroupsCount: groups.length,
        note: "Automation running in background via Puppeteer." 
    });

    // Пускаме я асинхронно на фокус
    postToFacebookGroups(groups, message);
});

app.get('/', (req, res) => {
    res.json({ status: "FACEBOOK FULL STACK AUTOMATION BOT ONLINE" });
});

app.listen(PORT, () => {
    console.log(`Facebook bot server running on port ${PORT}`);
});

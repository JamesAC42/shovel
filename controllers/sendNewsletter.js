const { sendEmail, getEmailContent } = require('../email/sendEmail');

async function sendNewsletter(req, res, models, redisClient) {
    const username = req.session.user?.username;
    if (!username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { folderName } = req.body;

    try {
        const adminUsernames = await getRedisSet(redisClient, 'shovel:admin_usernames');
        if (!adminUsernames.includes(username)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const users = await models.User.findAll({ attributes: ['email'] });
        const unsubscribedEmails = await getRedisSet(redisClient, 'shovel:unsubscribed');
        const sentKey = `shovel:newslettersent:${folderName}`;
        const sentEmails = await getRedisSet(redisClient, sentKey);

        const emails = users
            .map(user => user.email)
            .filter(email => email && !unsubscribedEmails.includes(email) && !sentEmails.includes(email));

        const { subject, text, html } = getEmailContent(folderName);

        const batchSize = 5;
        const results = [];

        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(email => sendEmailWithRetry(email, subject, html, text, redisClient, sentKey))
            );
            results.push(...batchResults);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 1 second delay between batches
        }

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.length - successCount;
        res.json({
            success: true,
            message: `Newsletter sent successfully to ${successCount} recipients. ${failureCount} failed.`
        });
    } catch (error) {
        console.error('Error in send process:', error);
        res.status(500).json({ success: false, message: 'Error sending newsletter' });
    }
}

async function sendEmailWithRetry(email, subject, html, text, redisClient, sentKey, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sendEmail(email, subject, html, text);
            await addToRedisSet(redisClient, sentKey, email);
            console.log(`Sent email to ${email} (attempt ${attempt})`);
            return { email, success: true };
        } catch (error) {
            console.error(`Error sending email to ${email} (attempt ${attempt}):`, error);
            if (attempt === maxRetries) {
                return { email, success: false };
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
    }
}

function getRedisSet(redisClient, key) {
    return new Promise((resolve, reject) => {
        redisClient.smembers(key, (err, members) => {
            if (err) reject(err);
            else resolve(members);
        });
    });
}

function addToRedisSet(redisClient, key, value) {
    return new Promise((resolve, reject) => {
        redisClient.sadd(key, value, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = sendNewsletter;
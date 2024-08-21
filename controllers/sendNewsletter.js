const { sendEmail, getEmailContent } = require('../email/sendEmail');

function sendNewsletter(req, res, models, redisClient) {
    const username = req.session.user?.username;
    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    const { folderName } = req.body;

    redisClient.smembers('shovel:admin_usernames', (err, adminUsernames) => {
        if (err) {
            console.error('Redis error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }

        if (!adminUsernames.includes(username)) {
            res.status(403).json({ success: false, message: 'Forbidden' });
            return;
        }

        models.User.findAll({
            attributes: ['email']
        })
        .then(users => {
            redisClient.smembers('shovel:unsubscribed', (err, unsubscribedEmails) => {

                if (err) {
                    console.error('Redis error:', err);
                    res.status(500).json({ success: false, message: 'Internal server error' });
                    return;
                }
                const emails = users
                    .map(user => user.email)
                    .filter(email => email && !unsubscribedEmails.includes(email));

                const {
                    subject,
                    text,
                    html
                } = getEmailContent(folderName);
            
                Promise.all(emails.map(email => sendEmail(email, subject, html, text)))
                    .then(() => {
                        res.json({ success: true, message: 'Newsletter sent successfully' });
                    })
                    .catch(error => {
                        console.error('Error sending emails:', error);
                        res.status(500).json({ success: false, message: 'Error sending newsletter' });
                    });
            });
        })
        .catch(error => {
            console.error('Database error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        });
    });
}

module.exports = sendNewsletter;
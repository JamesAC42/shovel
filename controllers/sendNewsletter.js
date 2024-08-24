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

                const sentKey = `shovel:newslettersent:${folderName}`;
                redisClient.smembers(sentKey, (err, sentEmails) => {
                    if (err) {
                        console.error('Redis error:', err);
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        return;
                    }

                    const emails = users
                        .map(user => user.email)
                        .filter(email => email && !unsubscribedEmails.includes(email) && !sentEmails.includes(email));

                    const {
                        subject,
                        text,
                        html
                    } = getEmailContent(folderName);

                    const sendPromises = emails.map(email => 
                        sendEmail(email, subject, html, text)
                            .then(() => {
                                redisClient.sadd(sentKey, email, (err) => {
                                    if (err) console.error(`Error adding ${email} to sent set:`, err);
                                });
                                return { email, success: true };
                            })
                            .catch(error => {
                                console.error(`Error sending email to ${email}:`, error);
                                return { email, success: false };
                            })
                    );

                    Promise.all(sendPromises)
                        .then(results => {
                            const successCount = results.filter(r => r.success).length;
                            const failureCount = results.length - successCount;
                            res.json({ 
                                success: true, 
                                message: `Newsletter sent successfully to ${successCount} recipients. ${failureCount} failed.` 
                            });
                        })
                        .catch(error => {
                            console.error('Error in send process:', error);
                            res.status(500).json({ success: false, message: 'Error sending newsletter' });
                        });
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
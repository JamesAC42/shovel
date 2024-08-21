const fs = require('fs');
const path = require('path');

function getNewsletters(req, res, redisClient) {
    const username = req.session.user?.username;
    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

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

        const emailDir = path.join(__dirname, '..', 'email');
        
        fs.readdir(emailDir, { withFileTypes: true }, (err, files) => {
            if (err) {
                console.error('File system error:', err);
                res.status(500).json({ success: false, message: 'Internal server error' });
                return;
            }

            const directories = files
                .filter(file => file.isDirectory())
                .map(dir => dir.name);

            res.json({ success: true, newsletters: directories });
        });
    });
}

module.exports = getNewsletters;
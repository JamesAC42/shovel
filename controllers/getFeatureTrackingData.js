const { collectFeatureTrackingData } = require('../featureTracking/collectFeatureTrackingData');

async function getFeatureTrackingData(req, res, redisClient) {
    const username = req.session.user?.username;
    if (!username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const adminUsernames = await new Promise((resolve, reject) => {
            redisClient.smembers('shovel:admin_usernames', (err, members) => {
                if (err) reject(err);
                else resolve(members);
            });
        });

        if (!adminUsernames.includes(username)) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const data = await collectFeatureTrackingData(redisClient);
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching feature tracking data:', error);
        res.status(500).json({ success: false, message: 'Error fetching feature tracking data' });
    }
}

module.exports = getFeatureTrackingData;

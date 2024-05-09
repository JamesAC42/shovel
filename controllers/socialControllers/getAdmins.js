async function getAdminUsernames(req, res, redisClient) {
    redisClient.smembers('shovel:admin_usernames', (err, adminUsernames) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error retrieving admin usernames' });
            return;
        }
        res.status(200).json({ success: true, adminUsernames: adminUsernames });
    });
}
module.exports = getAdminUsernames;
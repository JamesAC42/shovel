const { promisify } = require('util');
const { Keys } = require('./Keys');
const { User } = require('../models/models');

async function collectFeatureTrackingData(redisClient) {
    const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
    const getAsync = promisify(redisClient.get).bind(redisClient);
    const zrangeAsync = promisify(redisClient.zrange).bind(redisClient);
    const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
    const keysAsync = promisify(redisClient.keys).bind(redisClient);

    const periods = ['daily', 'weekly', 'monthly'];
    const data = {};

    for (const period of periods) {
        const featureUsage = await zrangeAsync(Keys[`${period}_feature_usage`] + getTimestamp(period), 0, -1, 'WITHSCORES');
        const featureUsageObj = {};
        for (let i = 0; i < featureUsage.length; i += 2) {
            featureUsageObj[featureUsage[i]] = parseInt(featureUsage[i + 1]);
        }

        const activeUserIds = await smembersAsync(Keys[`${period}_active_users`] + getTimestamp(period));
        const newUserIds = await smembersAsync(Keys[`${period}_new_users`] + getTimestamp(period));

        const activeUsers = await getUsernamesFromIds(activeUserIds);
        const newUsers = await getUsernamesFromIds(newUserIds);

        data[period] = {
            active_users: activeUsers,
            new_users: newUsers,
            requests: parseInt(await getAsync(Keys[`${period}_requests`] + getTimestamp(period)) || '0'),
            feature_usage: featureUsageObj
        };
    }

    const popularFeatures = await zrangeAsync(Keys.popular_features, 0, -1, 'WITHSCORES');
    const popularFeaturesObj = {};
    for (let i = 0; i < popularFeatures.length; i += 2) {
        popularFeaturesObj[popularFeatures[i]] = parseInt(popularFeatures[i + 1]);
    }
    data.popular_features = popularFeaturesObj;

    // Collect user info
    const userInfoKeys = await keysAsync(Keys.user_info + '*');

    data.user_info = {};
    for (const key of userInfoKeys) {
        const userId = key.split(':').pop();
        const userInfo = await hgetallAsync(key);
        const user = await User.findByPk(userId);
        if (user) {
            data.user_info[userId] = {
                username: user.username,
                last_login: parseInt(userInfo.last_login),
                last_login_date: new Date(parseInt(userInfo.last_login)).toISOString()
            };
        }
    }

    return data;
}

async function getUsernamesFromIds(userIds) {
    const users = await User.findAll({
        where: {
            id: userIds
        },
        attributes: ['id', 'username']
    });
    return users.map(user => ({ id: user.id, username: user.username }));
}

module.exports = {
    logUserRequest: require('./logUserRequest'),
    collectFeatureTrackingData
};

function getTimestamp(period) {
    const now = new Date();
    switch (period) {
        case 'daily':
            return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        case 'weekly':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            return `${startOfWeek.getFullYear()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`;
        case 'monthly':
            return `${now.getFullYear()}-${now.getMonth() + 1}`;
    }
}

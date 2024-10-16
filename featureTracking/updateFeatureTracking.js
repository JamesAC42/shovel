const { promisify } = require('util');
const {Keys} = require('./Keys');

// Helper function to get the current timestamp for different periods
const getTimestamp = (period) => {
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
};

// Update active users
async function updateActiveUsers(redisClient, userId, period) {
    const saddAsync = promisify(redisClient.sadd).bind(redisClient);
    const key = Keys[`${period}_active_users`] + getTimestamp(period);
    await saddAsync(key, userId);
}

// Update new users
async function updateNewUsers(redisClient, userId, period) {
    const saddAsync = promisify(redisClient.sadd).bind(redisClient);
    const key = Keys[`${period}_new_users`] + getTimestamp(period);
    await saddAsync(key, userId);
}

// Update requests
async function updateRequests(redisClient, period) {
    const incrAsync = promisify(redisClient.incr).bind(redisClient);
    const key = Keys[`${period}_requests`] + getTimestamp(period);
    await incrAsync(key);
}

// Update feature usage
async function updateFeatureUsage(redisClient, feature, period) {
    const zincrbyAsync = promisify(redisClient.zincrby).bind(redisClient);
    const key = Keys[`${period}_feature_usage`] + getTimestamp(period);
    await zincrbyAsync(key, 1, feature);
}

// Update user info
async function updateUserInfo(redisClient, userId) {
    const hmsetAsync = promisify(redisClient.hmset).bind(redisClient);
    const key = Keys.user_info + userId;
    await hmsetAsync(key, 'last_login', Date.now());
}

// Update popular features
async function updatePopularFeatures(redisClient) {
    const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
    const key = Keys.popular_features;
    const dailyKey = Keys.daily_feature_usage + getTimestamp('daily');
    const zrangeAsync = promisify(redisClient.zrange).bind(redisClient);
    const features = await zrangeAsync(dailyKey, 0, -1, 'WITHSCORES');
    
    for (let i = 0; i < features.length; i += 2) {
        await zaddAsync(key, features[i + 1], features[i]);
    }
}

module.exports = {
    updateActiveUsers,
    updateNewUsers,
    updateRequests,
    updateFeatureUsage,
    updateUserInfo,
    updatePopularFeatures
};

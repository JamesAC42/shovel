const {
    updateActiveUsers,
    updateNewUsers,
    updateRequests,
    updateFeatureUsage,
    updateUserInfo,
    updatePopularFeatures
} = require('./updateFeatureTracking');
const { features } = require('./Keys');
const getUserIdFromUsername = require('../repositories/getUserIdFromUsername');
async function logUserRequest(redisClient, req, feature) {

    try {
        const username = req.session.user?.username;

        if (!features.includes(feature)) {
            console.error(`Invalid feature: ${feature}`);
            return;
        }

        if (username) {
            const userId = await getUserIdFromUsername(username);
            if (feature !== 'created_account') {
                await updateActiveUsers(redisClient, userId, 'daily');
                await updateActiveUsers(redisClient, userId, 'weekly');
                await updateActiveUsers(redisClient, userId, 'monthly');
            } else {
                await updateNewUsers(redisClient, userId, 'daily');
                await updateNewUsers(redisClient, userId, 'weekly');
                await updateNewUsers(redisClient, userId, 'monthly');
            }

            if (feature !== 'created_account') {
                await updateUserInfo(redisClient, userId);
            }
        }

        await updateRequests(redisClient, 'daily');
        await updateRequests(redisClient, 'weekly');
        await updateRequests(redisClient, 'monthly');

        await updateFeatureUsage(redisClient, feature, 'daily');
        await updateFeatureUsage(redisClient, feature, 'weekly');
        await updateFeatureUsage(redisClient, feature, 'monthly');

        await updatePopularFeatures(redisClient);
        
    } catch (error) {
        console.error('Error logging user request:', error);
    }
}

module.exports = logUserRequest;

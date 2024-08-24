const getIsSubscribed = async (redisClient, email) => {
    return new Promise((resolve, reject) => {
        redisClient.sismember('shovel:unsubscribed', email, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result === 1);
            }
        });
    });
};
module.exports = getIsSubscribed;
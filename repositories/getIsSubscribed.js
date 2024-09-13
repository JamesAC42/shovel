const getIsSubscribed = async (redisClient, email) => {
    return new Promise((resolve, reject) => {
        redisClient.sismember('shovel:unsubscribed', email, (err, result) => {
            if (err) {
                reject(err);
            } else {
                let unsubscribed = result === 1;
                resolve(!unsubscribed);
            }
        });
    });
};
module.exports = getIsSubscribed;
function subscribeNewsletter(req, res, models, redisClient) {

    const username = req.session.user?.username;
    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    models.User.findOne({ where: { username: username } })
    .then(user => {
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        redisClient.srem("shovel:unsubscribed", user.email, (err) => {
            if(err) {
                console.error(err);
                res.status(404).json({ success: false, message: 'Error subscribing.' });
                return;
            }
            res.send({ success: true });
        })
    })
    .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });

}

module.exports = subscribeNewsletter;
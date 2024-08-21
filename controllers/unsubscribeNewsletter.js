function unsubscribeNewsletter(req, res, models, redisClient) {

    const username = req.session.user?.username;
    if (!username) {
        res.status(401).json({ success: false, message: 'Login first to unsubscribe.' });
        return;
    }

    models.User.findOne({ where: { username: username } })
    .then(user => {
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        let email = user.email;
        redisClient.sadd("shovel:unsubscribed", email, (err) => {
            if(err) {
                console.error(err);
                return res.status(400).json({ success: false, message: "Error unsubscribing." });
            }
            return res.send({ success: true });
        });
    })
    .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });

}

module.exports = unsubscribeNewsletter;
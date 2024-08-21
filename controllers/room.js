const room = (req, res, models, redisClient) => {
    
  if(!req.session.user?.username) {
    res.json({success:false});
  } else {
    models.User.findOne({ where: { username: req.session.user.username } })
        .then(user => {
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
            } else {
                redisClient.sismember('shovel:unsubscribed', user.email, (err, result) => {
                    if (err) {
                        console.error('Error checking Redis set:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        res.json({ 
                            success: true,
                            user: {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                email: user.email,
                                color: user.color,
                                dateCreated: user.dateCreated,
                                subscribedEmail: !result
                            }
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.error('Error retrieving user from the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
  }

}
module.exports = room;
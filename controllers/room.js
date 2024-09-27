const getIsSubscribed = require("../repositories/getIsSubscribed");

const room = (req, res, models, redisClient) => {
    
  if(!req.session.user?.username) {
    res.json({success:false});
  } else {
    models.User.findOne({ where: { username: req.session.user.username } })
        .then(async (user) => {
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
            } else {
                
                let subscribedEmail = false;
                if(user.email) {
                    subscribedEmail = await getIsSubscribed(redisClient, user.email);
                }
                let tier = user.tier ? user.tier : 1;
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
                        subscribedEmail,
                        tier: tier 
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
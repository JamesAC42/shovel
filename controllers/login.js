const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const login = async (req, res, models, redisClient) => {

    const { user, password } = req.body;
    if (!user || !password || user.trim() === "" || password.trim() === "") {
        res.send({ success: false, message: "Username/Email or password cannot be empty." });
        return;
    }

    try {
        const foundUser = await models.User.findOne({
            where: {
                [Op.or]: [
                    { email: user },
                    { username: user }
                ]
            }
        });

        if (!foundUser) {
            res.send({ success: false, message: "Username/Email or password is incorrect." });
            return;
        }

        if(!foundUser.password) {
            res.send({ success: false, message: "Sign in with Google."});
            return;
        }

        const result = await bcrypt.compare(password, foundUser.password);
        if (!result) {
            res.send({ success: false, message: "Username/Email or password is incorrect." });
            return;
        }
        
        redisClient.sismember('shovel:unsubscribed', foundUser.email, (err, result) => {
            if (err) {
                console.error('Error checking Redis set:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                req.session.user = { username: foundUser.username };
                res.json({ 
                    success: true,
                    user: { 
                        id: foundUser.id,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        username: foundUser.username,
                        email: foundUser.email,
                        color: foundUser.color,
                        dateCreated: foundUser.dateCreated,
                        subscribedEmail: !result
                    }
                });
            }
        });
    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
module.exports = login;
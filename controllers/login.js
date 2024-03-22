const bcrypt = require('bcrypt');

const login = (req, res, models) => {

    const { username, password } = req.body;
    if(!username || !password || username.trim() === "" || password.trim() === "") {
        res.send({ success: false, message: "Username or password cannot be empty." });
        return;
    }

    models.User.findOne({ where: { username: username } })
        .then(user => {
            if (!user) {
                res.send({ success: false, message: "Username or password is incorrect." });
            } else {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else if (!result) {
                        console.log("asdf");
                        res.send({ success: false, message: "Username or password is incorrect." });
                    } else {
                        req.session.user = { username };
                        res.json({ 
                            success: true,
                            user: { 
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                color: user.color,
                                dateCreated: user.dateCreated
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
module.exports = login;
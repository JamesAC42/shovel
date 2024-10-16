const {User} = require("../models/models");

const getUserIdFromUsername = (username) => {
    return User.findOne({ where: { username: username } })
        .then(user => {
            if (!user) {
                return null;
            }
            return user.id;
        })
        .catch(err => {
            console.error('Error retrieving user from the database:', err);
            throw err;
        });
}
module.exports = getUserIdFromUsername;
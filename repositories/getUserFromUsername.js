const getUserFromUsername = (models, username) => {
    return models.User.findOne({ where: { username: username } })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                dateCreated: user.dateCreated,
                color: user.color,
                username: user.username
            };
        })
        .catch(err => {
            console.error('Error retrieving user from the database:', err);
            throw err;
        });
}
module.exports = getUserFromUsername;
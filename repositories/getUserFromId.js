const getUserFromId = (models, id) => {
    return models.User.findOne({ where: { id: id } })
        .then(user => {
            if (!user) {
                return null;
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
module.exports = getUserFromId;
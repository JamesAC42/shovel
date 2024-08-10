const getGoalAmount = async (models, userId, room) => {
    try {
        const goalCount = await models.Goal.count({
            where: {
                userId,
                room
            }
        });
        return goalCount;
    } catch (error) {
        console.error('Error getting goal amount:', error);
        throw error;
    }
};

module.exports = getGoalAmount;

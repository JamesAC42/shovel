const getTaskAmount = async (models,goal) => {

    try {
        const taskCount = await models.Task.count({
            where: {
                goalId: goal
            }
        });
        return taskCount;
    } catch (error) {
        console.error('Error getting task amount:', error);
        throw error;
    }

}
module.exports = getTaskAmount;
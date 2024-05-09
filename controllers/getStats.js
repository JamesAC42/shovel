const { Op } = require("sequelize");

async function getStats(req, res, models) {
    try {
        const numberOfUsers = await models.User.count();
        const numberOfRooms = await models.Room.count();
        const totalHoursTracked = await models.DeepWorkHourTracker.sum('hours');
        const totalGoals = await models.Goal.count();
        const totalTasksCompleted = await models.Task.count({ where: 
            { dateCompleted: { [Op.ne]: null } } });
        const totalJournalEntries = await models.Journal.count();

        res.json({
            success: true,
            data: {
                numberOfUsers,
                numberOfRooms,
                totalHoursTracked,
                totalGoals,
                totalTasksCompleted,
                totalJournalEntries
            }
        });

    } catch (error) {
        console.error('Failed to retrieve stats:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
    }
};
module.exports = getStats;

const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function deleteGoal(req, res, models, io) {

    const username = req.session.user?.username;
    let { goal } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!goal) {
        res.status(500).json({ success: false, message: 'Invalid format' });
        return;
    }

    try {
        const user = await getUserFromUsername(models, username);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const goalItem = await models.Goal.findOne({ where: { id: goal } });
        if (!goalItem) {
            res.status(404).json({ success: false, message: 'Goal not found or does not belong to user' });
            return;
        }

        if(goalItem.userId !== user.id) {
            res.status(500).json({ success: false, message: 'You do not own this goal'});
            return;
        }

        const tasks = await models.Task.findAll({ where: { goalId: goal } });
        for (let task of tasks) {
            await models.TaskTag.destroy({ where: { taskId: task.id } });
        }
        await models.Task.destroy({ where: { goalId: goal } });
        await models.Goal.destroy({ where: { id: goal } });
        
        const socketRoom = `room_${goalItem.room}`;
        io.to(socketRoom).emit('deleteGoal', {
            user: user.id,
            goal
        });

        res.status(200).json({ success: true, message: 'Goal successfully deleted' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = deleteGoal;
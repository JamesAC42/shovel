async function deleteTask(req, res, models, io) {

    const username = req.session.user?.username;
    let { room, goal, task } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room || !goal || !task) {
        res.status(500).json({ success: false, message: 'Invalid format' });
        return;
    }

    try {
        const user = await models.User.findOne({ where: { username: username } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const roomItem = await models.Room.findOne({ where: { id: room } });
        if (!roomItem) {
            res.status(404).json({ success: false, message: 'Room not found' });
            return;
        }

        const goalItem = await models.Goal.findOne({ where: { id: goal, userId: user.id } });
        if (!goalItem) {
            res.status(404).json({ success: false, message: 'Goal not found or does not belong to user' });
            return;
        }

        const taskItem = await models.Task.findOne({ where: { id: task, goalId: goal } });
        if (!taskItem) {
            res.status(404).json({ success: false, message: 'Task not found or does not belong to goal' });
            return;
        }

        const taskOrder = taskItem.order;

        await models.TaskTag.destroy({ where: { taskId: task } });
        await models.Task.destroy({ where: { id: task } });

        const allTasks = await models.Task.findAll({ 
            where: { goalId: goal },
            order: [['order', 'ASC']]
        });
        const allTasksCompleted = allTasks.every(task => task.dateCompleted !== null);

        // Update order for remaining tasks
        const tasksToUpdate = allTasks.filter(t => t.order > taskOrder);
        if (tasksToUpdate.length > 0) {
            await Promise.all(tasksToUpdate.map(t => 
                models.Task.update(
                    { order: t.order - 1 },
                    { where: { id: t.id } }
                )
            ));
        }
        
        let goalCompletedDate = null;
        if (allTasks.length > 0 && allTasksCompleted) {
            goalCompletedDate = allTasks.reduce((latest, task) => {
                return (
                    new Date(latest.dateCompleted).getTime() > new Date(task.dateCompleted).getTime()) ? 
                    latest : task;
            }).dateCompleted;
            goalItem.endDate = goalCompletedDate;
            await goalItem.save();
        }
        if(goalItem.endDate && allTasks.length === 0) {
            goalItem.endDate = null;
            await goalItem.save();
        }

        const socketRoom = `room_${roomItem.id}`;
        io.to(socketRoom).emit('deleteTask', {
            user: user.id,
            goal,
            task,
            goalCompletedDate
        });

        res.status(200).json({ success: true, message: 'Task successfully deleted' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = deleteTask;
async function editTask(req, res, models, io) {

    const username = req.session.user?.username;
    let { room, goal, task, title, description, tags } = req.body;

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

        // Update the task fields
        if(title) taskItem.title = title;
        if(description) taskItem.description = description;
        await taskItem.save();

        // Update the task tags
        if(tags) {
            await models.TaskTag.destroy({ where: { taskId: task } });
            for(let tag of tags) {
                await models.TaskTag.create({
                    taskId: task,
                    tag
                });
            }
        }
        
        res.status(200).json({ success: true, message: 'Task updated successfully' });
        io.to(room).emit('editTask', { task: taskItem });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = editTask;

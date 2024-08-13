const sequelize = require('../../database');
const { Op } = require("sequelize");

async function updateTaskOrder(req, res, models) {

    const username = req.session.user?.username;
    let { room, goal, task, newIndex } = req.body;

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

        const oldOrder = taskItem.order;
        const allTasks = await models.Task.findAll({
            where: { goalId: goal },
            order: [['order', 'ASC']]
        });

        for(let i = 0; i < allTasks.length; i++) {
            if(allTasks[i].order === 0) {
                await allTasks[i].update({ order: i + 1});
            }
        }

        if (newIndex < 0 || newIndex >= allTasks.length) {
            res.status(400).json({ success: false, message: 'Invalid new index' });
            return;
        }

        const newOrder = newIndex + 1;

        if (oldOrder < newOrder) {
            await models.Task.update(
                { order: sequelize.literal('"order" - 1') },
                { where: { goalId: goal, order: { [Op.between]: [oldOrder + 1, newOrder] } } }
            );
        } else if (oldOrder > newOrder) {
            await models.Task.update(
                { order: sequelize.literal('"order" + 1') },
                { where: { goalId: goal, order: { [Op.between]: [newOrder, oldOrder - 1] } } }
            );
        }

        await taskItem.update({ order: newOrder });
        res.status(200).json({ success: true, message: 'Task successfully moved' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = updateTaskOrder;
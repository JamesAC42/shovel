const sequelize = require('../../database');
const { Op } = require("sequelize");

async function updateGoalOrder(req, res, models) {

    const username = req.session.user?.username;
    let { room, goal, newIndex } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room || !goal) {
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

        const oldOrder = goalItem.order;
        const allGoals = await models.Goal.findAll({
            where: { room: room },
            order: [['order', 'ASC']]
        });

        if (newIndex < 0 || newIndex >= allGoals.length) {
            res.status(400).json({ success: false, message: 'Invalid new index' });
            return;
        }

        const newOrder = newIndex + 1;

        if (oldOrder < newOrder) {
            await models.Goal.update(
                { order: sequelize.literal('"order" - 1') },
                { where: { room: room, order: { [Op.between]: [oldOrder + 1, newOrder] } } }
            );
        } else if (oldOrder > newOrder) {
            await models.Goal.update(
                { order: sequelize.literal('"order" + 1') },
                { where: { room: room, order: { [Op.between]: [newOrder, oldOrder - 1] } } }
            );
        }

        await goalItem.update({ order: newOrder });
        res.status(200).json({ success: true, message: 'Goal successfully moved' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = updateGoalOrder;
const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function archiveGoal(req, res, models, io) {
    const username = req.session.user?.username;
    let { goal } = req.body;

    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if (!goal) {
        res.status(400).json({ success: false, message: 'Goal ID is required' });
        return;
    }

    try {
        const user = await getUserFromUsername(models, username);
        const goalItem = await models.Goal.findOne({ where: { id: goal, userId: user.id } });

        if (!goalItem) {
            res.status(404).json({ success: false, message: 'Goal not found or does not belong to user' });
            return;
        }

        goalItem.archived = true;
        await goalItem.save();

        res.status(200).json({ success: true, message: 'Goal archived successfully' });

        const socketRoom = `room_${goalItem.room}`;
        io.to(socketRoom).emit('goalArchived', {
            user: user.id,
            goal: goalItem.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = archiveGoal;
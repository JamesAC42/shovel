const getUserFromUsername = require("../../repositories/getUserFromUsername");
const {
    deleteDeepWorkHours,
    deleteJournals,
    deleteRoomRequests,
    deleteRoomUsers,
    deleteStreakHighscores,
    deleteStreakTracker,
    deleteGoals,
    deleteTags
} = require("../../repositories/deleteRoomData");

const deleteRoom = async (req, res, models) => {
    const username = req.session.user?.username;
    const { room } = req.body;

    if (!username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!room) {
        return res.status(400).json({ success: false, message: 'Room ID is required' });
    }

    try {
        const user = await getUserFromUsername(models, username);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const roomExists = await models.Room.findOne({ where: { id: room } });
        if (!roomExists) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room } });
        if (!userInRoom) {
            return res.status(403).json({ success: false, message: 'User not in room' });
        }

        const roomUsers = await models.RoomUser.findAll({ where: { room } });
        if (roomUsers.length > 1) {
            return res.status(403).json({ success: false, message: 'Cannot delete room with other users' });
        }

        // Delete all associated data
        await deleteDeepWorkHours(models, room);
        await deleteJournals(models, room);
        await deleteRoomRequests(models, room);
        await deleteRoomUsers(models, room);
        await deleteStreakHighscores(models, room);
        await deleteStreakTracker(models, room);
        await deleteGoals(models, room);
        await deleteTags(models, room);

        // Delete the room itself
        await models.Room.destroy({ where: { id: room } });

        res.status(200).json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = deleteRoom;
const getUserFromUsername = require("../../repositories/getUserFromUsername");
const {
    deleteDeepWorkHours,
    deleteJournals,
    deleteRoomRequests,
    deleteRoomUser,
    deleteStreakHighscores,
    deleteStreakTracker,
    deleteGoals,
    deleteTags
} = require("../../repositories/deleteRoomUserData");

const leaveRoom = async (req, res, models, io) => {
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

        // Delete all associated user data from the room
        await deleteDeepWorkHours(models, room, user.id);
        await deleteJournals(models, room, user.id);
        await deleteRoomRequests(models, room, user.id);
        await deleteRoomUser(models, room, user.id);
        await deleteStreakHighscores(models, room, user.id);
        await deleteStreakTracker(models, room, user.id);
        await deleteGoals(models, room, user.id);
        await deleteTags(models, room, user.id);

        res.status(200).json({ success: true, message: 'Successfully left the room' });

        // Emit socket event to notify other users in the room
        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('userLeftRoom', {
            userId: user.id,
            username: user.username
        });
        
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = leaveRoom;
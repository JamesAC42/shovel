const renameRoom = async (req, res, models, io) => {
    try {
        const username = req.session.user?.username;
        const { room, newName } = req.body;

        if (!username) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!room || !newName) {
            return res.status(400).json({ success: false, message: 'Room ID and new name are required' });
        }

        // Sanitize and validate the new room name
        const sanitizedName = newName.trim().replace(/[^\w\s-]/gi, '');
        if (sanitizedName.length === 0 || sanitizedName.length > 50) {
            return res.status(400).json({ success: false, message: 'Invalid room name. It must be between 1 and 50 characters long and contain only letters, numbers, spaces, and hyphens.' });
        }

        const user = await models.User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const roomItem = await models.Room.findOne({ where: { id: room } });
        if (!roomItem) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room } });
        if (!userInRoom) {
            return res.status(403).json({ success: false, message: 'User not in room' });
        }

        // Update the room name
        roomItem.name = sanitizedName;
        await roomItem.save();

        // Emit socket event to notify other users in the room
        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('roomRenamed', {
            newName: sanitizedName
        });

        res.status(200).json({ success: true, message: 'Room renamed successfully', newName: sanitizedName });

    } catch (error) {
        console.error('Error renaming room:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while renaming the room' });
    }
}

module.exports = renameRoom;
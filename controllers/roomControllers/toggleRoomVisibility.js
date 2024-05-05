const getUserFromUsername = require("../../repositories/getUserFromUsername");
const validateUserInRoom = require("../../repositories/validateUserInRoom");

async function toggleRoomVisibility(req, res, models, io) { 
    
    const username = req.session.user?.username;
    let { room } = req.body;

    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room) {
        res.status(500).json({ success: false, message: 'Invalid format.' });
        return;
    }
    room = parseInt(room);
    if (isNaN(room)) {
        res.status(400).json({ success: false, message: 'Invalid format for room.' });
        return;
    }
    
    try {

        let user = await getUserFromUsername(models, username);
        const validRoom = await validateUserInRoom(models, user.id, room);
        if(!validRoom) {
            res.status(403).json({ success: false, message: 'User not in room.'});
            return;
        }

        const roomData = await models.Room.findByPk(room);
        if (!roomData) {
            res.status(404).json({ success: false, message: 'Room not found.' });
            return;
        }

        const currentVisibility = roomData.public;
        const newVisibility = currentVisibility === null ? true : !currentVisibility;

        await roomData.update({ public: newVisibility });

        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('visibilityUpdate', {
            public: newVisibility
        });

        res.status(200).json({ success: true, message: `Visibility set to ${newVisibility ? "on" : "off"}` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = toggleRoomVisibility;
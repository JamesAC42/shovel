const getUserFromUsername = require('../repositories/getUserFromUsername');

const createRoom = async (req, res, models) => {

    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not logged in.' });
    }

    const roomName = req.body.roomName;
    if(!roomName || roomName.length > 50) {
        return res.status(400).json({ success: false, message: 'Room name is required.' });
    }

    try {
        let user;
        user = await getUserFromUsername(models, req.session.user.username);

        const rooms = await models.RoomUser.findAll({ where: { userId: user.id } });
        if (rooms.length >= 5) {
            return res.status(400).json({ success: false, message: 'You are already in the max number of rooms.' });
        }

        const newRoom = await models.Room.create({name: roomName});
        const roomId = newRoom.id;
        await models.RoomUser.create({ room: roomId, userId: user.id });
    
        return res.json({success:true, roomId});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error retrieving data.' });
    }

}
module.exports = createRoom;
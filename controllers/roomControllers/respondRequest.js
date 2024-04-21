const getUserFromUsername = require("../../repositories/getUserFromUsername");
const validateUserInRoom = require("../../repositories/validateUserInRoom");

async function respondRequest(req, res, models, io) {

    const username = req.session.user?.username;
    let { requestUsername, room, accept } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!requestUsername || !room) {
        res.status(500).json({ success: false, message: 'Invalid format' });
        return;
    }

    try {

        let user = await getUserFromUsername(models, username);
        const validRoom = await validateUserInRoom(models, user.id, room);
        if(!validRoom) {
            res.status(403).json({ success: false, message: 'User not in room.'});
            return;
        }

        let requestUser = await getUserFromUsername(models, requestUsername);
        const roomRequest = await models.RoomRequest.findOne({ 
            where: { userId: requestUser.id, room } 
        });
        if(!roomRequest) {
            res.status(404).json({ success: false, message: 'No request found for this user in this room.' });
            return;
        }

        let userInfo = null;
        await roomRequest.destroy();
        if(accept) {
            await models.RoomUser.create({
                room: room,
                userId: requestUser.id
            });
            userInfo = await models.User.findOne({ where: { id: requestUser.id }});
            delete userInfo.dataValues.password;
        }

        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('roomRequestResponse', {
            accept,
            username:requestUsername,
            userInfo,
        })


    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
        return;
    }

}
module.exports = respondRequest;
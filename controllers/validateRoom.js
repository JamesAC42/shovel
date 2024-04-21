const getUserFromUsername = require("../repositories/getUserFromUsername");

const validateRoom = async (req, res, models, io) => {

    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'User not logged in.' });
    }

    let roomId = req.body.roomId;
    if (!roomId) {
        return res.status(400).json({ success: false, message: 'Room ID is required.' });
    }
    if (isNaN(roomId)) {
        return res.status(400).json({ success: false, message: 'Room ID must be a number.' });
    }
    roomId = parseInt(roomId);

    let user;
    try {
        user = await getUserFromUsername(models, req.session.user.username);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error retrieving user.' });
    }

    models.Room.findOne({ where: { id: roomId } })
    .then(room => {
        if (!room) {
            return res.json({ success: false, message: 'Room not found.' });
        }

        models.RoomUser.findOne({ where: { room: roomId, userId: user.id} })
        .then(async (roomUser) =>  {
            
            if (roomUser) {
                return res.json({ success: true });
            }

            let roomUsersCount = 0;
            try {
                roomUsersCount = await models.RoomUser.count({ where: { room: roomId } });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error counting users in room.' });
            }

            if(roomUsersCount > 6) {
                return res.status(400).json({ success: false, message: 'Max number of users already in this room.' });
            }

            const roomsUserIn = await models.RoomUser.findAll({ where: { userId: user.id } });
            if (roomsUserIn.length > 5) {
                return res.status(400).json({ success: false, message: 'You are already in the max number of rooms.' });
            }

            models.RoomRequest.findOne({ where: { room: roomId, userId: user.id } })
            .then(roomRequest => {
                if (roomRequest) {
                    return res.json({ success: false, alreadyRequested: true });
                }
                models.RoomRequest.create({ room: roomId, userId: user.id })
                .then(() => {
                    const socketRoom = `room_${roomId}`;
                    io.to(socketRoom).emit('newJoinRequest', {
                        username: user.username
                    });
                    return res.json({ success: false, requestSent: true });
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Error creating room request.' });
                });
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error checking if user is in room.' });
        });
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error checking if room exists.' });
    });


}
module.exports = validateRoom;
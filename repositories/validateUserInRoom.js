async function validateUserInRoom(models, userId, room) {

    const roomExists = await models.Room.findOne({ where: { id: room }});
    if(!roomExists) {
        return false;
    }

    const userInRoom = await models.RoomUser.findOne({ where: { userId, room }});
    if(!userInRoom) {
        return false;
    }

    return true;

}

module.exports = validateUserInRoom;
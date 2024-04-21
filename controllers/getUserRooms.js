function getUserRooms(req, res, models) {

    
    const username = req.session.user?.username;
    console.log(username);
    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }

    models.User.findOne({ where: { username: username } })
    .then(user => {
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        models.RoomUser.findAll({ 
            where: { userId: user.id },
            include: [{
                model: models.Room,
                attributes: ['name']
            }]
        })
        .then(rooms => {
            const roomData = rooms.map(room => ({ id: room.room, name: room.Room.name }));
            res.json({ success: true, rooms: roomData });
        })
        .catch(err => {
            console.error('Error:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        });
    })
    .catch(err => {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });

}
module.exports = getUserRooms;
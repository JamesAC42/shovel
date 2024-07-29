const publicRooms = async (req, res, models) => {
      
      try {
        const rooms = await models.Room.findAll({
          where: {
            public: true
          },
          include: [
            {
              model: models.User,
              through: {
                model: models.RoomUser,
                attributes: []
              },
              attributes: ['username']
            }
          ],
          attributes: ['id', 'name']
        });
    
        // Format the result
        const formattedRooms = rooms.map(room => ({
          id: room.id,
          name: room.name,
          users: room.Users.map(user => user.username)
        }));
    
        return res.send({success: true, rooms: formattedRooms});
      } catch (error) {
        console.error('Error fetching public rooms with users:', error);
        res.status(400).json({ success: false, message: "Internal server error."});
      }

}
module.exports = publicRooms;
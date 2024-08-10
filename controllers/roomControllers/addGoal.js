const getGoalAmount = require("../../repositories/getGoalAmount");
const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function addGoal(req, res, models, io) {

    const username = req.session.user?.username;
    let { room, goal, date } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room || !goal || !date) {
        res.status(500).json({ success: false, message: 'Invalid format' });
        return;
    }

    // Validate date format
    const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateRegEx.test(date)) {
        res.status(400).json({ success: false, message: 'Invalid date format. Expected format: yyyy-mm-dd' });
        return;
    }

    // Validate date is no more than 1 day ahead or behind the current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(date);
    const diffTime = Math.abs(currentDate - inputDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(diffDays > 1) {
        res.status(400).json({ 
            success: false, 
            message: 'Invalid date. Date should be no more than 1 day ahead or behind the current date.' });
        return;
    }

    if(typeof goal !== 'string' || goal.length < 1 || goal.length > 100) {
        res.status(400).json({ success: false, message: 'Invalid goal. Goal should be a string of at least 1 character and at most 100 characters.' });
        return;
    }
    try {
        
        const user = await getUserFromUsername(models, username);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const roomExists = await models.Room.findOne({ where: { id: room } });
        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room } });

        if (!roomExists) {
            res.status(404).json({ success: false, message: 'Room not found' });
            return;
        }
        if (!userInRoom) {
            res.status(403).json({ success: false, message: 'User not in room' });
            return;
        }

        const goalAmount = await getGoalAmount(models, user.id, room);

        let newGoal = await models.Goal.create({
            room: room,
            userId: user.id,
            startDate: date,
            endDate: null,
            status: null,
            description: null,
            title: goal,
            order: goalAmount + 1
        });

        if (!newGoal) {
            res.status(500).json({ success: false, message: 'Failed to create goal' });
            return;
        }

        res.status(200).json({ success: true, message: 'Goal created successfully', goal: newGoal });

        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('newGoal', {
            goal: newGoal
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }


}
module.exports = addGoal;
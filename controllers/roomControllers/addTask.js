const getTaskAmount = require("../../repositories/getTaskAmount");
const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function addTask(req, res, models, io) {

    const username = req.session.user?.username;
    let { room, goal, task, date, tags} = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room || !goal || !task || !date || !tags) {
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
    
    // Validate tags is a list of strings of at least length 1 and max 50
    if(!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || tag.length < 1 || tag.length > 50)) {
        res.status(400).json({ success: false, message: 'Invalid tags. Each tag should be a string of at least 1 character and at most 50 characters.' });
        return;
    }

    let filteredTags = [];
    for(let tag of tags) {
        if(filteredTags.indexOf(tag) === -1 && filteredTags.length < 50) {
            filteredTags.push(tag);
        }
    }

    tags = filteredTags;

    if(typeof task !== 'string' || task.length < 1 || task.length > 100) {
        res.status(400).json({ success: false, message: 'Invalid task. Task should be a string of at least 1 character and at most 100 characters.' });
        return;
    }

    try {

        const user = await getUserFromUsername(models, username);
        const roomExists = await models.Room.findOne({ where: { id: room } });
        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room } });
        const validateGoal = await models.Goal.findOne({ where: { id: goal, userId: user.id, room } });

        if (!roomExists) {
            res.status(404).json({ success: false, message: 'Room not found' });
            return;
        }
        if (!userInRoom) {
            res.status(403).json({ success: false, message: 'User not in room' });
            return;
        }
        if (!validateGoal) {
            res.status(403).json({ success: false, message: 'Goal does not belong to user in this room' });
            return;
        }

        const taskAmount = await getTaskAmount(models, goal);

        const newTask = await models.Task.create({
            goalId: goal,
            userId: user.id,
            title: task,
            description: task,
            dateCreated: date,
            order: taskAmount + 1
        });

        if (!newTask) {
            res.status(500).json({ success: false, message: 'Failed to create task' });
            return;
        }

        for(let tag of tags) {

            
            let tagItem;
            tagItem = await models.Tag.findOne({ where: { tag: tag, room: room } });
            if (!tagItem) {
                tagItem = await models.Tag.create({
                    tag: tag,
                    room: room,
                    userId: user.id
                });
            }

            const taskTagItem = await models.TaskTag.create({
                taskId: newTask.id,
                tag: tagItem.id
            });

            if (!taskTagItem) {
                res.status(500).json({ success: false, message: 'Failed to create task tag' });
                return;
            }

        }

        await models.Goal.update({ endDate: null }, { where: { id: goal } });

        res.status(200).json({ success: true, message: 'Task created successfully' });

        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('newTask', {
            goal,
            user: user.id,
            newTask,
            tags
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = addTask;
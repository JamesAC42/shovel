const validateUserInRoom = require("../../repositories/validateUserInRoom");

async function saveWorkHours(req, res, models, io) {

    const username = req.session.user?.username;
    let { date, hours, wasNotable, accomplishment, room } = req.body;

    if (!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!date || !room) {
        res.status(500).json({ success: false, message: 'Invalid format.' });
        return;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        res.status(400).json({ success: false, message: 'Invalid format for date. It should be in the format yyyy-mm-dd.' });
        return;
    }
    hours = parseInt(hours);
    if (isNaN(hours) || hours < 0 || hours > 8) {
        res.status(400).json({ success: false, message: 'Invalid format for hours. It should be a number between 0 and 8.' });
        return;
    }
    room = parseInt(room);
    if (isNaN(room)) {
        res.status(400).json({ success: false, message: 'Invalid format for room.' });
        return;
    }
    
    let user;
    try {
        user = await models.User.findOne({ where: { username } });

        const validRoom = await validateUserInRoom(models, user.id, room);
        if(!validRoom) {
            res.status(403).json({ success: false, message: 'User not in room' });
            return;
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const [year, month, day] = date.split('-').map(Number);
    const inputDate = new Date(Date.UTC(year, month - 1, day));
    if(inputDate.getTime() - currentDate.getTime() > 1000 * 60 * 60 * 24) {
        res.status(500).json({ success: false, message: 'Date cannot be in the future'});
        return;
    }

    wasNotable = wasNotable === true || wasNotable === 'true';
    if (typeof wasNotable !== 'boolean') {
        res.status(400).json({ success: false, message: 'Invalid format for wasNotable. It should be a boolean.' });
        return;
    }

    if (typeof accomplishment !== 'string') {
        accomplishment = '';
    }

    if (accomplishment && accomplishment.length > 150) {
        res.status(400).json({ success: false, message: 'Accomplishment exceeds maximum length of 150 characters.' });
        return;
    }
    try {
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        let entry = await models.DeepWorkHourTracker.findOne({ 
            where: { 
                userId: user.id,
                date,
                room
            }
        });

        let success = false;
        if (entry) {

            // Update existing entry
            try {
                await entry.update({
                    hours: hours,
                    wasNotable: wasNotable,
                    accomplishment: accomplishment
                });
                res.status(200).json({ success: true, message: 'Work hours updated successfully.' });
                success = true;
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        } else {

            // Create new entry
            try {
                await models.DeepWorkHourTracker.create({
                    room,
                    userId: user.id,
                    date,
                    hours,
                    wasNotable,
                    accomplishment
                });
                
                res.status(201).json({ success: true, message: 'Work hours saved successfully.' });
                success = true;
            } catch (err) {
                console.error('Error:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        }

        if(success) {
            const socketRoom = `room_${room}`;
            io.to(socketRoom).emit('newHourInfo', {
                room,
                user: user.id,
                date,
                hours,
                wasNotable,
                accomplishment
            });
        }

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

}
module.exports = saveWorkHours;
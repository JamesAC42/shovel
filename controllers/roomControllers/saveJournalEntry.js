const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function saveJournalEntry(req, res, models, io) {

    const username = req.session.user?.username;
    let { room, entry, date, tags } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!room  || !date || !tags) {
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

    // Validate entry is a string of at least 1 and at most 5000 characters
    if(typeof entry !== 'string' || entry.length > 5000) {
        res.status(400).json({ 
            success: false, 
            message: 'Invalid entry. Entry should be a string of at least 1 and at most 5000 characters.' });
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

    try {

        const user = await getUserFromUsername(models, username);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const roomItem = await models.Room.findOne({ where: { id: room } });
        if (!roomItem) {
            res.status(404).json({ success: false, message: 'Room not found' });
            return;
        }

        const userInRoom = await models.RoomUser.findOne({ where: { userId: user.id, room: room } });
        if (!userInRoom) {
            res.status(403).json({ success: false, message: 'User not in room' });
            return;
        }

        let journalEntry = await models.Journal.findOne({ where: { 
            userId: user.id,
            date,
            room
        } });
        
        let deleted = false;
        if (journalEntry) {
            await models.JournalTag.destroy({ where: { journalEntry: journalEntry.id } });
            if (entry === '') {
                await models.Journal.destroy({ where: { 
                    userId: user.id, 
                    room: room, 
                    id: journalEntry.id
                } });
                deleted = true;
            } else {
                journalEntry.entry = entry;
                await journalEntry.save();
            }
        } else {

            if(entry === '') {
                return res.status(201).json({ success: true, message: 'Nothing to save.' });
            }

            journalEntry = await models.Journal.create({
                userId: user.id,
                room: room,
                date: date,
                entry: entry
            });
        }

        if(!deleted) {
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
    
                const journalTagItem = await models.JournalTag.create({
                    journalEntry: journalEntry.id,
                    tag: tagItem.id
                });
    
                if (!journalTagItem) {
                    res.status(500).json({ success: false, message: 'Failed to create journal tag' });
                    return;
                }
            }
        }
        
        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('journalEntryUpdate', {
            user: user.id,
            entry,
            journalId: journalEntry?.id,
            date,
            tags
        });

        res.status(201).json({ success: true, message: 'Journal entry saved.' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server error' });
        return;
    }

}
module.exports = saveJournalEntry;
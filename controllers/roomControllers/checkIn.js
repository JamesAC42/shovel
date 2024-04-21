const getElapsedDays = require("../../repositories/getElapsedDays");
const getUserFromUsername = require("../../repositories/getUserFromUsername");

async function checkIn(req, res, models, io) {
    
    const username = req.session.user?.username;
    let { room, date } = req.body;

    if(!username) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
    }
    if(!date || !room) {
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
    const inputDate = new Date(date);
    const diffTime = Math.abs(currentDate - inputDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if(diffDays > 1) {
        res.status(400).json({ 
            success: false, 
            message: 'Invalid date. Date should be no more than 1 day ahead or behind the current date.' });
        return;
    }

    try {

        const user = await getUserFromUsername(models, username);
        const streakTrackerEntry = await models.StreakTracker.findOne({ 
            where: { userId: user.id, room } });
            const highScoreEntry = await models.StreakHighscore.findOne({
                where: { userId: user.id, room } });

        let startDate,endDate,highScoreStartDate,highScoreEndDate;

        if(!streakTrackerEntry) {
            startDate = date;
            endDate = date;
            highScoreStartDate = date;
            highScoreEndDate = date;
            await models.StreakTracker.create({
                userId: user.id,
                room: room,
                startDate,
                endDate,
            });
            await models.StreakHighscore.create({
                userId: user.id,
                room,
                startDate: highScoreStartDate,
                endDate: highScoreEndDate
            });
        } else {
            
            let oldStreakEndDate = streakTrackerEntry.endDate;
            // if date is 1 day after old end date, 
            let elapsedDays = getElapsedDays(oldStreakEndDate, date);
            if(elapsedDays === 0) {
                res.status(500).json({success:false, message: "Already checked in today."});
                return;
            }

            if(elapsedDays > 1) {
                startDate = date;
                endDate = date;
            } else {
                startDate = streakTrackerEntry.startDate;
                endDate = date;
            }

            await models.StreakTracker.update({
                startDate,
                endDate,
            }, {
                where: { userId: user.id, room }
            });

            let currentStreak = getElapsedDays(startDate, endDate) + 1;
            if(!highScoreEntry) {
                highScoreStartDate = startDate;
                highScoreEndDate = endDate;
                await models.StreakHighscore.create({
                    userId: user.id,
                    room,
                    startDate: highScoreStartDate,
                    endDate: highScoreEndDate
                });
            } else {
                let currentHighScore = getElapsedDays(highScoreEntry.startDate, highScoreEntry.endDate) + 1;
                if(currentStreak > currentHighScore) {
                    highScoreStartDate = startDate;
                    highScoreEndDate = endDate;
                    await models.StreakHighscore.update({
                        startDate: highScoreStartDate,
                        endDate: highScoreEndDate
                    }, {
                        where: { userId: user.id, room }
                    });
                }
            }
        }

        res.status(200).json({ success: true, message: "Check-in successful." });
        
        const socketRoom = `room_${room}`;
        io.to(socketRoom).emit('streakUpdate', {
            user: user.id,
            startDate,
            endDate,
            highScoreStartDate,
            highScoreEndDate
        });

    } catch(err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
        return;
    }
    
    

}
module.exports = checkIn;
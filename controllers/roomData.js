const getDeepWorkWeek = require("../repositories/getDeepWorkWeek");

async function roomData (req, res, models) {

    let roomId = req.query.id;
    const username = req.session.user?.username;

    if (!username) {
        res.json({ success: false, message: "User not logged in." });
        return;
    }

    if (isNaN(roomId)) {
        res.json({ success: false, message: "Room ID must be a number." });
        return;
    }
    roomId = parseInt(roomId);

    try {
        const room = await models.Room.findOne({ where: { id: roomId } });
        if (!room) {
            res.json({ success: false, message: "Room not found." });
            return;
        }

        const currentUser = await models.User.findOne({ where: { username: username } });
        if (!currentUser) {
            res.json({ success: false, message: "User not found." });
            return;
        }

        const userRoom = await models.RoomUser.findOne({ where: { userId: currentUser.id, room: roomId } });
        if (!userRoom) {
            res.json({ success: false, message: "User does not belong to this room." });
            return;
        }
        
        // this is the data to be sent back and the structure:
        /* let data = {
            users: {
                [id]: {
                    userInfo: {},
                    deepWorkTracker: {},
                    currentStreak: {days, startDate},
                    streakHighScore: {days,startDate,endDate},
                    goals: {
                        [id]: {
                            title,
                            description,
                            startDate,
                            endDate,
                            goalStatus,
                            tasks: [{
                                title,
                                description,
                                dateCreated,
                                dateCompleted,
                                tags: [
                                    //just strings
                                ]
                            }]
                        }
                    },
                    journal: {
                        [id]: {
                            date,
                            entry,
                            tags: [
                                //just string
                            ] 
                        }
                    },
                },
            },
            joinRequests: [
                // usernames
            ]
        }
        */

        let data = {};
        data.users = {};
        
        const roomUsers = await models.RoomUser.findAll({ where: { room: roomId } });
        const joinRequests = await models.RoomRequest.findAll({ where: { room: roomId } });

        for (let user of roomUsers) {

            let userid = user.get("userId");
            let userInfo = await models.User.findOne({ where: { id: userid } });
            delete userInfo.dataValues.password;
            
            let deepWorkTracker = await getDeepWorkWeek(userid, roomId, models.DeepWorkHourTracker);
            let currentStreak = await models.StreakTracker.findOne({ where: { userId: userid, room: roomId } });
            let streakHighScore = await models.StreakHighscore.findOne({ where: { userId: userid, room: roomId } });
            let goals = await models.Goal.findAll({ where: { userId: userid, room: roomId } });
            let journal = await models.Journal.findAll({ where: { userId: userid, room: roomId } });

            if(currentStreak) { 
                delete currentStreak.dataValues.room;
                delete currentStreak.dataValues.userId;
            }
            if(streakHighScore) {
                delete streakHighScore.dataValues.userId;
                delete streakHighScore.dataValues.room;
            }

            let goalsData = {};
            for (let goal of goals) {
                const tasks = await models.Task.findAll({ where: { goalId: goal.id } });
                let tasksData = tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    dateCreated: task.dateCreated,
                    dateCompleted: task.dateCompleted,
                    tags: [] 
                }));

                for (let task of tasksData) {
                    const taskTags = await models.TaskTag.findAll({ 
                        where: { taskId: task.id },
                        include: [{
                            model: models.Tag,
                            as: 'Tag',
                            attributes: ['tag']
                        }] 
                    });
                    task.tags = taskTags.map(taskTag => taskTag.Tag.tag);
                }

                goalsData[goal.id] = {
                    id: goal.id,
                    title: goal.title,
                    description: goal.description,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    goalStatus: goal.status,
                    tasks: tasksData
                };
            }

            let journalData = {};
            for (let entry of journal) {
                journalData[entry.id] = {
                    date: entry.date,
                    entry: entry.entry,
                    tags: [] // TODO: Fetch tags for each journal entry
                };
                const journalTags = await models.JournalTag.findAll({ 
                    where: { journalEntry: entry.id },    
                    include: [{
                        model: models.Tag,
                        as: 'Tag',
                        attributes: ['tag']
                    }]
                });
                journalData[entry.id].tags = journalTags.map(journalTag => journalTag.Tag.tag);
                
            }

            data.users[userid] = {
                userInfo: userInfo,
                deepWorkTracker: deepWorkTracker,
                currentStreak: currentStreak,
                streakHighScore: streakHighScore,
                goals: goalsData,
                journal: journalData
            };
        }

        data.joinRequests = await Promise.all(joinRequests.map(async (request) => {
            let user = await models.User.findOne({ where: { id: request.userId } });
            delete user.dataValues.password;
            return user.username;
        }));

        data.id = roomId;
        data.name = room.name;

        res.json({success:true, data});

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "An error occurred." });
    }

}

module.exports = roomData;
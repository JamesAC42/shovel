const { Op } = require("sequelize");

async function getDeepWorkWeek(userid, room, DeepWorkHourTracker) {

    const today = new Date();
    const sunday = today.getDate() - today.getDay();
    const startDate = new Date(today.setDate(sunday));
    const endDate = new Date(today.setDate(sunday + 6));

    let deepWorkTracker = await DeepWorkHourTracker.findAll({ 
        where: { 
            userId: userid, 
            room,
            date: {                
                [Op.between]: [startDate, endDate]
            }
        } 
    });
    if (!deepWorkTracker.length) {
        deepWorkTracker = [];
    }

    return deepWorkTracker;

}
module.exports = getDeepWorkWeek;
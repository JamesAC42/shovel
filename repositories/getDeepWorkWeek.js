const { Op } = require("sequelize");

async function getDeepWorkWeek(userid, room, inputDate, DeepWorkHourTracker) {

    const today = new Date(`${inputDate}T00:00:00Z`);
    const startDate = new Date(today.getTime() - (today.getUTCDay() * 1000 * 60 * 60 * 24)).toISOString().split('T')[0];

    let deepWorkTracker = await DeepWorkHourTracker.findAll({ 
        where: { 
            userId: userid, 
            room,
            date: {                
                [Op.between]: [startDate, inputDate]
            }
        } 
    });
    if (!deepWorkTracker.length) {
        deepWorkTracker = [];
    }

    return deepWorkTracker;

}
module.exports = getDeepWorkWeek;
function updateWorkHours(data, {user, date, hours, wasNotable}) {

    if(!user) return data;

    let newData = JSON.parse(JSON.stringify(data));
    let found = false;
    for(let entry of newData.users[user].deepWorkTracker) {
        if(entry.date === date) {
            entry.hours = hours;
            entry.wasNotable = wasNotable;
            found = true;
        }
    }
    if(!found) {
        newData.users[user].deepWorkTracker.push({
            hours,
            date,
            wasNotable
        });
    }
    return newData;

}
export default updateWorkHours;
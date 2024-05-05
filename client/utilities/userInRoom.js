function userInRoom(roomData, user) {

    if(!roomData) return false;
    let users = Object.keys(roomData);
    for(let u of users) {
        if(u === user) {
            return true;
        }
    }
    return false;

}
export default userInRoom;
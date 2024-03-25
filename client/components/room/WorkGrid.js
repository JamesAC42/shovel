import { useState, useContext } from "react";
import RoomContext from "../../pages/RoomContext";
import UserContext from "../../pages/UserContext";
import styles from "../../styles/room/workgrid.module.scss";

Date.prototype.addDays=function(d){return new Date(this.valueOf()+864E5*d);};

function WorkGrid() {

    const {roomData, setRoomData} = useContext(RoomContext);
    const { userInfo } = useContext(UserContext);
    
    const getWeekDay = (dayNum) => {
        return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayNum];
    } 

    /*
    deepWorkHours: {
        user: [{
            hours,
            date,
            wasNotable,
            accomplishment
        }]
    }
    userInfo: {
        user: {
            username,
            firstname,
            lastname,
            color,
            currentStreak,
            streakHighscore
        }
    }
    */

    if(roomData === null) return null;

    const deepWorkHours = {};
    const userData = {};
    const users = Object.keys(roomData.users);

    for(let user of users) {
        deepWorkHours[user] = roomData.users[user].deepWorkTracker;
        userData[user] = roomData.users[user].userInfo;
    }

    let dateList = [];
    let userdates = {};
    for(let user of users) {
        let dates = {}
        for(let dateEntry of deepWorkHours[user]) {
            if(!dates[dateEntry.date]) {
                dates[dateEntry.date] = [];
            }
            dates[dateEntry.date].push(dateEntry);
        }
        userdates[user] = dates;
    }
    const today = new Date().getDay();
    for(let day = 0; day <= today; day++) {
        let weekDay = new Date();
        weekDay.addDays(-1 * (today - day))
        dateList.push(weekDay);
    }

    const renderWorkMarkers = (user, date) => {
        let workMarkers = [];
        let workHours = userdates[user][date];
        if(!workHours) return workMarkers;
        for(let i = 0; i < workHours.hours; i++) {
            if(userDates[user][date].wasNotable) {
                workMarkers.push(
                    <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                )
            } else {
                workMarkers.push(
                    <span className={styles.workMarker}><TbCircleFilled/></span>
                )
            }
        }
        return <td>{workMarkers}</td>
    }

    const getUserTotalHours = (user) => {
        if(!deepWorkHours[user]) return 0;
        let total = 0;
        for(let workEntry of deepWorkHours[user]) {
            total += workEntry.hours;
        }
    }

    const renderStreak = (user) => {
        const currentStreak = userData[user].currentStreak;
        const streakHighscore = userData[user].streakHighscore;
        return `${currentStreak ? currentStreak : 0}/${streakHighscore ? streakHighscore : 0}`;
    }

    const streakStyle = (user) => {
        let currentStreak = userData[user].currentStreak ?? 0;
        return(`${styles.streak} ${currentStreak > 0 ? styles.streakActive : ""}`);
    }

    return (
        <div className={styles.workGrid}>
            <table>
                <tr>
                    <td></td>
                    <td className={styles.streakHeader}>streak</td>
                    {
                        dateList.map((date) => 
                            <td>{getWeekDay(date.getDay())}</td>
                        )
                    }
                    <td></td>
                </tr>
                {
                    users.map(user =>
                    <tr>
                        <td>{userData[user].username}</td>
                        <td>
                            <span className={streakStyle(user)}>
                                {renderStreak(user)}
                            </span>
                        </td>
                        {
                            dateList.map((date) => renderWorkMarkers(user, date))
                        }
                        <td><span className={styles.workTotal}>
                            { getUserTotalHours(user) }
                        </span></td>
                    </tr>
                    )
                }
            </table>
        </div>
    )
}
export default WorkGrid;
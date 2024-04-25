import { useState, useEffect, useContext } from "react";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";
import { TbCircleFilled } from "react-icons/tb";
import styles from "../../styles/room/workgrid.module.scss";
import statsStyles from "../../styles/room/statspanel.module.scss";
import getWeekDay from "../../utilities/getWeekDay";
import parseDateString from "../../utilities/parseDateString";
import getToday from "../../utilities/getToday";
import elapsedDays from "../../utilities/elapsedDays";
import dateToReadable from "../../utilities/dateToReadable";

Date.prototype.addDays=function(d){return new Date(this.valueOf()+864E5*d);};

function WorkGrid() {

    let { roomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);

    let [userDates, setUserDates] = useState({});
    let [dateList, setDateList] = useState([]);

    let intervalId;

    const renderWorkMarkers = (user, date) => {

        if(!userDates[user]) return null;
        let workMarkers = [];
        let weekDay = getWeekDay(new Date(date).getDay());
        let workHours = userDates[user][weekDay];
        if(!workHours) return <td></td>;
        for(let i = 0; i < workHours.hours; i++) {
            if(userDates[user][weekDay].wasNotable) {
                workMarkers.push(
                    <span key={i} className={statsStyles.workMarkerSpecial}><TbCircleFilled/></span>
                )
            } else {
                workMarkers.push(
                    <span key={date + "_" + i} className={statsStyles.workMarker}><TbCircleFilled/></span>
                )
            }
        }
        return <td key={user + weekDay}>{workMarkers}</td>
    }

    const getUserTotalHours = (user) => {
        if(!roomData.users) return "";
        const deepWorkHours = roomData.users[user].deepWorkTracker;
        let total = 0;
        for(let workEntry of deepWorkHours) {
            total += workEntry.hours;
        }
        return total.toString();
    }

    const streakTooltip = (dates) => {
        if(!dates?.startDate) return "";
        return `${dateToReadable(dates.startDate)}-${dateToReadable(dates.endDate)}`;
    }

    const renderStreak = (user) => {
        if(!roomData.users) return "";
        let currentStreakAmt = 0;
        let highScoreStreakAmt = 0;
        const currentStreak = roomData.users[user].currentStreak;
        const streakHighscore = roomData.users[user].streakHighScore;
        let startDate, endDate;
        if(currentStreak) {
            
            startDate = currentStreak.startDate;
            endDate = currentStreak.endDate;

            let today = getToday();
            let streakElapsed = elapsedDays(endDate, today);
            if(streakElapsed > 1) {
                currentStreakAmt = 0;
            } else {
                currentStreakAmt = elapsedDays(startDate, endDate) + 1;
            }
            
        }
        if(streakHighscore) {
            startDate = streakHighscore.startDate;
            endDate = streakHighscore.endDate;
            highScoreStreakAmt = elapsedDays(startDate, endDate) + 1;
        }
        return(
            <div className={streakStyle(user)}>
                <div title={streakTooltip(currentStreak)}>
                    {currentStreakAmt}
                </div>
                <div title={streakTooltip(streakHighscore)}>
                    {highScoreStreakAmt}
                </div>
            </div>
        )
    }

    const streakStyle = (user) => {
        if(!roomData.users) return "";
        return(`${styles.streak}`);
    }

    const initDateList = () => {
        
        // list of dates from sunday to today
        let datelist = [];

        const today = new Date();
        for(let day = 0; day <= today.getDay(); day++) {
            let weekDay = today.addDays(-1 * (today.getDay() - day))
            datelist.push(weekDay);
        }
        setDateList(datelist);

    }

    const initUserDates = () => {
        
        const deepWorkHours = {};
        const users = Object.keys(roomData.users);

        for(let user of users) {
            deepWorkHours[user] = roomData.users[user].deepWorkTracker;
        }

        // {user_id: {day: date_entry}}
        let userdates = {};
        for(let user of users) {
            userdates[user] = {};
            for(let dateEntry of deepWorkHours[user]) {
                
                let weekDay = getWeekDay(parseDateString(dateEntry.date));
                userdates[user][weekDay] = dateEntry;
            }
        }

        setUserDates(userdates);
    }

    useEffect(() => {
        
        initUserDates();

    }, [userInfo, roomData]);

    useEffect(() => {

        if(intervalId) {
            clearInterval(intervalId);
        }
        initDateList();
        intervalId = setInterval(() => {
            initDateList();
        }, 5000);

        return () => {
            if(intervalId) {
                clearInterval(intervalId);
            }
        }

    }, [roomData]);

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
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        color: user.color,
        dateCreated: user.dateCreated
    }
    */

    if(roomData === null) return null;
    if(userInfo === null) return null;
    if(dateList.length === 0) return null;
    if(Object.keys(userDates).length === 0) return null;

    return (
        <div className={styles.workGrid}>
            <table>
                <thead>
                    <tr>
                        <td></td>
                        <td className={styles.streakHeader}>streak</td>
                        {
                            dateList.map((date) => 
                                <td key={date}>{getWeekDay(date.getDay())}</td>
                            )
                        }
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                {
                    Object.keys(roomData.users).map(user =>
                    <tr key={roomData.users[user].userInfo.username}>
                        <td>{roomData.users[user].userInfo.username}</td>
                        <td className={styles.streakCell}>
                            {renderStreak(user)}
                        </td>
                        {
                            dateList.map((date) => renderWorkMarkers(user, date))
                        }
                        <td>
                            <span className={styles.workTotal}>
                            { getUserTotalHours(user) }
                            </span>
                        </td>
                    </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}
export default WorkGrid;
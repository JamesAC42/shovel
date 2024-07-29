import styles from '../../styles/room/statspanel.module.scss';
import { TbCircleFilled } from "react-icons/tb";
import { useContext, useState } from "react";
import { FaUndo } from "react-icons/fa";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";
import getWeekDay from '../../utilities/getWeekDay';
import updateWorkHours from '../../reducers/updateWorkHours';
import parseDateString from '../../utilities/parseDateString';
import getToday from '../../utilities/getToday';

function WorkButton({className, onClick, spanClass, children}) {

    let [clicked, setClicked] = useState(false);

    const onMouseDown = () => {
        setClicked(true);
    }
    
    const onMouseUp = () => {
        setClicked(false);
    }
    
    const onMouseOut = () => {
        setClicked(false);
    }

    const getClass = () => {
        return `${className} ${clicked ? styles.clicked : ''}`
    }

    return (
        <div
            onClick={() => onClick()} 
            className={getClass()}
            onMouseDown={() => onMouseDown()}
            onMouseUp={() => onMouseUp()}
            onMouseOut={() => onMouseOut()}>
            <span className={spanClass}>{children}</span>
        </div>
    )

}

export default function DeepWorkButtons() {

    let { roomData, setRoomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);

    const getHourInfo = () => {

        if(!roomData?.id) return;
        if(!userInfo?.id && !roomData.guest) return;

        let date, hours, wasNotable;
        let userId = roomData.guest ? 1 : userInfo.id;
        const deepWorkHours = roomData.users[userId].deepWorkTracker;

        let today = getWeekDay(new Date().getDay());
        let found = false;
        for(let workEntry of deepWorkHours) {
            let weekDay = getWeekDay(parseDateString(workEntry.date));
            if(weekDay === today) {
                date = workEntry.date;
                hours = workEntry.hours;
                wasNotable = workEntry.wasNotable;
                found = true;
            }
        }
        if(!found) {
            date = getToday();
            hours = 0;
            wasNotable = false;
        }
        return {date, hours, wasNotable};
    }

    const addHourClass = () => {
        const hourInfo = getHourInfo();
        let hours = hourInfo ? hourInfo.hours : 0;
        return `${styles.workButton} ${hours < 8 ? '': styles.disabled}`;
    }

    const removeHourClass = () => {
        const hourInfo = getHourInfo();
        let hours = hourInfo ? hourInfo.hours : 0;
        return `${styles.workButton} ${hours > 0 ? '': styles.disabled}`;
    }

    const toggleNotableClass = () => {
        const hourInfo = getHourInfo();
        let hours = hourInfo ? hourInfo.hours : 0;
        return `${styles.workButton} ${hours > 0 ? '': styles.disabled}`;
    }

    const addHour = (amt) => {
        let {date, hours, wasNotable} = getHourInfo();
        hours += amt;

        if(hours < 0 || hours > 8) {
            return;
        }

        saveHours(date, hours, wasNotable, roomData.id);
    }

    const toggleNotable = () => {
        let {date, hours, wasNotable} = getHourInfo();
        wasNotable = !wasNotable;
        saveHours(date, hours, wasNotable, roomData.id);
    }

    const saveHours = async (date, hours, wasNotable, roomId) => {

        if(!roomId) return;
        if(!date) return;

        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            let found = false;
            for(let entry of newData.users[1].deepWorkTracker) {
                if(entry.date === date) {
                    entry.hours = hours;
                    entry.wasNotable = wasNotable;
                    found = true;
                }
            }
            if(!found) {
                newData.users[1].deepWorkTracker.push({
                    hours,
                    date,
                    wasNotable
                });
            }
            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);

        } else {
            const response = await fetch('/api/saveWorkHours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, hours, wasNotable, room: roomId }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            }
        }


    };

    if(!userInfo && !roomData.guest) return null;
    if(!roomData.users[userInfo.id]) return null;

    return (
        <div className={styles.workButtons}>
            <div className={styles.addButtons}>
                <WorkButton
                    onClick={() => addHour(1)} 
                    className={addHourClass()}>
                    <span title="Add Hour of Work" className={styles.workMarker}><TbCircleFilled/></span>
                </WorkButton>
                <WorkButton
                    onClick={() => toggleNotable()} 
                    className={removeHourClass()}>
                    <span title="Toggle Accomplishment Made" className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                </WorkButton>
            </div>
            <div className={styles.undoButton}>
                <WorkButton
                    onClick={() => addHour(-1)} 
                    className={toggleNotableClass()}>
                    <span title="Remove Hour of Work" className={styles.undoButton}><FaUndo /></span>
                </WorkButton>
            </div>
        </div>
    )
}
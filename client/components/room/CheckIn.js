import btnstyles from '../../styles/room/checkinbutton.module.scss';
import {useContext, useState, useEffect} from 'react';
import { TbShovel } from "react-icons/tb";
import { FaRegCheckCircle  } from "react-icons/fa";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";
import getToday from '../../utilities/getToday';
import elapsedDays from '../../utilities/elapsedDays';

function calculateNewStreak(currentStreak, highScore) {

    let date = getToday();
    let startDate,endDate,highScoreStartDate,highScoreEndDate;

    if(!currentStreak) {

        startDate = date;
        endDate = date;
        highScoreStartDate = date;
        highScoreEndDate = date;
    
    } else {
        
        let oldStreakEndDate = currentStreak.endDate;
        let elapsed = elapsedDays(oldStreakEndDate, date);
        if(elapsed === 0) {
            return null;
        }

        if(elapsed > 1) {
            startDate = date;
            endDate = date;
        } else {
            startDate = currentStreak.startDate;
            endDate = date;
        }

        let currentStreakDays = elapsedDays(startDate, endDate) + 1;
        if(!highScore) {
            highScoreStartDate = startDate;
            highScoreEndDate = endDate;
        } else {
            highScoreStartDate = highScore.startDate;
            highScoreEndDate = highScore.endDate;
            let currentHighScore = elapsedDays(highScore.startDate, highScore.endDate) + 1;
            if(currentStreakDays > currentHighScore) {
                highScoreStartDate = startDate;
                highScoreEndDate = endDate;
            }
        }
    }

    return {
        currentStreak: {
            startDate,
            endDate
        },
        highScore: {
            startDate: highScoreStartDate,
            endDate: highScoreEndDate
        }
    }

}

function CheckIn() {

    let { roomData, setRoomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);
    
    let [clicked, setClicked] = useState(false);
    let [done, setDone] = useState(false);

    let streakInterval;

    const click = async () => {

        if(done) return;
        if(!roomData?.id) return;

        if(roomData.guest) {

            let newStreak = calculateNewStreak(roomData.users[1].currentStreak, roomData.users[1].streakHighScore);
            if(!newStreak) return;
            const {
                currentStreak,
                highScore
            } = newStreak;
            let newRoomData = JSON.parse(JSON.stringify(roomData));
            newRoomData.users[1].currentStreak = currentStreak;
            newRoomData.users[1].streakHighScore = highScore;
            localStorage.setItem("guest-room", JSON.stringify(newRoomData));
            setRoomData(newRoomData);

        } else {

            let today = getToday();
            const response = await fetch('/api/checkIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ room: roomData.id, date:today }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            } else {
                setClicked(true);
                if(!done) setDone(true);
                setTimeout(() => {
                    setClicked(false);
                }, 500);
            }
        }
    }

    const checkToday = () => {

        if(!roomData) return;
        if(!userInfo && !roomData.guest) return;

        let today = getToday();
        let userId = roomData.guest ? 1 : userInfo.id;

        if(!roomData?.users[userId]) return;
        let currentStreak = roomData?.users[userId].currentStreak;
        if(currentStreak) { 
            let streakEnd = currentStreak.endDate;
            if(streakEnd === today) {
                setDone(true);
                return;
            }
        }
        setDone(false);
    }

    useEffect(() => {

        if(streakInterval) {
            clearInterval(streakInterval);
        }

        checkToday();
        streakInterval = setInterval(() => {
            checkToday();
        }, 5000);

        return () => {
            clearInterval(streakInterval);
        };

    }, [roomData, userInfo]);

    if(!roomData) return null;
    if(!userInfo && !roomData.guest) return null;
    if(!roomData.users[userInfo.id]) return null;

    return (
        <div
            onClick={() => click()}
            className={`${
                btnstyles.checkInButton
            } ${
                clicked ? btnstyles.checkInButtonClicked : ''
            } ${
                done ? '' : btnstyles.notDone
            }`}>
            <span>
                {
                    done ?
                    <>
                    Checked In <FaRegCheckCircle  />
                    </> :
                    <>
                    <TbShovel /> Check In Today
                    </>
                }
            </span>
        </div>
    )
}
export default CheckIn;
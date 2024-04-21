import btnstyles from '../../styles/room/checkinbutton.module.scss';
import {useContext, useState, useEffect} from 'react';
import { TbShovel } from "react-icons/tb";
import { FaRegCheckCircle  } from "react-icons/fa";
import RoomContext from "../../pages/RoomContext";
import UserContext from "../../pages/UserContext";
import getToday from '../../utilities/getToday';
import elapsedDays from '../../utilities/elapsedDays';

function CheckIn() {

    let { roomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);
    
    let [clicked, setClicked] = useState(false);
    let [done, setDone] = useState(false);

    let streakInterval;

    const click = async () => {
        if(done) return;
        
        if(!roomData?.id) return;

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

    const checkToday = () => {

        if(!roomData) return;
        if(!userInfo) return;

        let today = getToday();
        let currentStreak = roomData?.users[userInfo.id].currentStreak;
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

    }, [roomData]);

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
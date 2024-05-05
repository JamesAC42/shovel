
import {useContext, useState} from 'react';
import UserContext from "../../contexts/UserContext";
import RoomContext from "../../contexts/RoomContext";
import { RiEyeFill } from "react-icons/ri";
import { RiEyeOffFill } from "react-icons/ri";

import styles from "../../styles/room/visibilitycontrol.module.scss";

function VisibilityControl() {

    const {roomData} = useContext(RoomContext);
    const {userInfo} = useContext(UserContext);

    const toggleRoomVisibility = async () => {

        const response = await fetch('/api/toggleRoomVisibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id
            }),
        });
        try {
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            }
        } catch(err) {
            console.log(err);
        }
    }

    if(!userInfo) return null;
    if(!roomData) return null;

    return(
        <div
            title={roomData.public ? "Room is public" : "Room is private"}
            onClick={() => toggleRoomVisibility()} 
            className={styles.visibilityControl}>
            {
                roomData.public ?
                <RiEyeFill /> : <RiEyeOffFill />
            }
        </div>
    )

}
export default VisibilityControl;
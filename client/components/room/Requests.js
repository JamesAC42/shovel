import { useState, useContext } from "react";
import RoomContext from "../../contexts/RoomContext";

import { IoMailUnread, IoMail } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";

import styles from "../../styles/room/requests.module.scss";
import UserContext from "../../contexts/UserContext";

function Requests() {

    const [showRequests, setShowRequests] = useState(false);
    const {roomData} = useContext(RoomContext);
    const {userInfo} = useContext(UserContext);

    const requestReply = async (username, accept) => {
        
        const response = await fetch('/api/respondRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                requestUsername: username, 
                room: roomData.id,
                accept
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

    const requests = roomData.joinRequests;

    if(!userInfo) return null;

    return (
        
        <div className={styles.requestNotifs}>
            <div onClick={() => setShowRequests(!showRequests)}>
            {
                requests.length > 0 ?
                <IoMailUnread /> : <IoMail />
            }
            </div>
            {
                showRequests ?
                <div className={styles.requests}>
                    <h4>join requests</h4>
                    {
                        requests.map((request) => 
                        <div className={styles.request}>
                            <div className={styles.requestName}>
                                {request}
                            </div>
                            <div className={styles.requestActions}>
                                <div
                                    onClick={() => requestReply(request, true)} 
                                    className={styles.approveRequest}>
                                    <FaCheck/>
                                </div>
                                <div
                                    onClick={() => requestReply(request, false)}  
                                    className={styles.declineRequest}>
                                    <CgCloseO />
                                </div>
                            </div>
                        </div>
                        )
                    }
                    {
                        requests.length === 0 ?
                        <h5>no requests</h5> : null
                    }
                </div> : null
            }
        </div>
    )
}
export default Requests;
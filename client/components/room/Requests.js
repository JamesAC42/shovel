import { useState, useContext } from "react";
import RoomContext from "../../pages/RoomContext";

import { IoMailUnread, IoMail } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";

import styles from "../../styles/room/requests.module.scss";

function Requests() {

    const [showRequests, setShowRequests] = useState(false);
    const {roomData, setRoomData} = useContext(RoomContext);

    const requestReply = (approve) => {
        
    }

    const requests = roomData.joinRequests;

    return (
        
        <div className={styles.requestNotifs}>
            <div onClick={() => setShowRequests(!showRequests)}>
            {
                roomData.joinRequests.length > 0 ?
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
                                {request.username}
                            </div>
                            <div className={styles.requestActions}>
                                <div
                                    onClick={() => requestReply(true)} 
                                    className={styles.approveRequest}>
                                    <FaCheck/>
                                </div>
                                <div
                                    onClick={() => requestReply(false)}  
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
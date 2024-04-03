import RoomContext from "../../pages/RoomContext";
import {useContext} from 'react';
import styles from '../../styles/roomlayout.module.scss';

export default function UserTabs({
    activeTab,
    setActiveTab
}) {

    const {roomData} = useContext(RoomContext);
    if(!roomData) return null;

    const users = Object.keys(roomData.users);
    if(users.length === 1) return null;

    return (
        
        <div className={styles.userTabPanel}>
            {
                users.map((user) =>
                    <div className={styles.userTab}>{roomData.users[user].userInfo.username}</div>
                )
            }
        </div>
    )

}
import RoomContext from "../../pages/RoomContext";
import {useContext} from 'react';
import styles from '../../styles/room/usertabs.module.scss';

export default function UserTabs({
    activeTab,
    setActiveTab
}) {

    const {roomData} = useContext(RoomContext);
    if(!roomData) return null;

    const users = Object.keys(roomData.users);
    if(users.length === 1) return null;

    const tabClass = (userId) => {
        return `${styles.userTab} ${activeTab === parseInt(userId) ? styles.userTabActive : ''}`;
    }

    return (
        
        <div className={styles.userTabPanel}>
            {
                users.map((user) =>
                    <div 
                        className={tabClass(user)}
                        onClick={() => setActiveTab(user)}>
                            {roomData.users[user].userInfo.username}
                    </div>
                )
            }
            <div className={styles.panelFiller}></div>
        </div>
    )

}
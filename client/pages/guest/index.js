import Head from "next/head";
import StatsPanel from "../../components/room/StatsPanel";
import Todo from "../../components/room/Todo";
import Journal from "../../components/room/Journal";
import styles from "../../styles/guest.module.scss";
import Link from "next/link";
import RoomContext from '../../contexts/RoomContext';
import { useEffect, useState } from "react";
import CustomThemePicker from '../../components/room/CustomThemePicker';
import {views} from "../../components/room/NavTabs";
import NavTabs from "../../components/room/NavTabs";
import Popup from '../../components/Popup';
import Tutorial from '../../components/room/Tutorial';

function Guest() {

    const [roomData, setRoomData] = useState({});
    const [activeView, setActiveView] = useState(views.todo);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {


        const seenTutorial = localStorage.getItem('shovel:seentutorial');
        console.log(seenTutorial);
        if (!seenTutorial || seenTutorial === 'false') {
            console.log("asdfasdf");
            setShowTutorial(true);
            localStorage.setItem('shovel:seentutorial', 'true');
        }

        let savedData = localStorage.getItem('guest-room');
        if(savedData) {
            setRoomData(JSON.parse(savedData));
        } else {
            let data = {
                users: {
                    1: {
                        userInfo: {},
                        deepWorkTracker: [],
                        currentStreak: null,
                        streakHighScore: null,
                        goals: {},
                        journal: {},
                    },
                },
                joinRequests: [],
                id: -1,
                name: "Guest Room",
                public: false,
                guest:true
            }
            
            setRoomData(data);
            localStorage.setItem('guest-room', JSON.stringify(data));
        }

    }, []);

    if(!roomData.users) return null;

    return(
        <RoomContext.Provider value={{roomData, setRoomData}}>
            <CustomThemePicker />
            <div className={styles.roomOuter}>
                <Head>
                    <title>shovel - productivity tool with journal & todo list - guest</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <StatsPanel activeView={activeView}/>
                <div className={styles.mainContentOuter}>
                    <div className={`${styles.mainContent} ${activeView === views.journal ? styles.showJournal : ""}`}>
                        <Todo  activeView={activeView}/>
                        <Journal  activeView={activeView}/>
                    </div>
                </div>
            </div>
            <NavTabs setActiveView={(activeView) => setActiveView(activeView)}/>
            {
                showTutorial ?
                <Popup onClose={() => setShowTutorial(false)}>
                    <Tutorial onClose={() => setShowTutorial(false)}/>
                </Popup> : null
            }
            <div className={styles.mobileNotice}>
                Shovel is currently only supported on desktop and laptop devices.
                <Link href="/">Go Back</Link>
            </div>
        </RoomContext.Provider>
    )

}
export default Guest;
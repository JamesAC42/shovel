import styles from '../../styles/room/statspanel.module.scss';

import Requests from './Requests';
import ThemePicker from '../ThemePicker';
import WorkGrid from './WorkGrid';
import DeepWorkButtons from './DeepWorkButtons';
import { BsFillPeopleFill } from "react-icons/bs";

import {useContext, useState, useEffect} from 'react';
import RoomContext from '../../contexts/RoomContext';
import UserContext from "../../contexts/UserContext";

import { MdOutlineExpandMore } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { BsGearFill } from "react-icons/bs";
import { IoMdBackspace } from "react-icons/io";
import { MdHome } from "react-icons/md";
import Link from 'next/link';
import CheckIn from './CheckIn';
import VisibilityControl from './VisibilityControl';
import Popup from '../Popup';
import NewsletterSignup from '../NewsletterSignup';
import Tutorial from './Tutorial';
import Settings from './Settings';

function StatsPanel({activeView}) {

    const {roomData} = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);
    const [statsExpanded, setStatsExpanded] = useState(true);

    const [showTutorial, setShowTutorial] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [showSocialNotif, setShowSocialNotif] = useState(false);

    useEffect(() => {
        const seenSocial = localStorage.getItem('shovel:seenNewsletter');
        if (!seenSocial || seenSocial === 'false') {
            setShowSocialNotif(true);
        }
    }, []);

    const collapsedStyle = () => (
        statsExpanded ? "" : styles.statsPanelCollapsed
    )

    const toggleBtnStyle = () => (
        statsExpanded ? "" : styles.toggleStatsPanelCollapsed
    )

    const deepWorkStyle = () => (
        statsExpanded ? `${styles.deepWorkWeek} ${styles.deepWorkWeekVisible}` : styles.deepWorkWeek
    )

    const weekOf = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mostRecentSunday = new Date(today.setDate(today.getDate() - dayOfWeek));
        const dateString = mostRecentSunday.toLocaleDateString();
        return dateString;
    }

    const userInRoom = () => {
        if(!userInfo) return false;
        if(!roomData) return false;
        return Object.keys(roomData.users).indexOf(userInfo.id.toString()) !== -1;
    }

    let showNewsLetter = false;
    if(showSocialNotif && userInfo && !userInfo.email) {
        showNewsLetter = true;
        localStorage.setItem('shovel:seenNewsletter', 'true');
    }

    return(
        <div 
            className={`${styles.statsPanelOuter} ${collapsedStyle()} ${activeView === 3 ? styles.visible : ''}`}>
            <div 
                className={`${styles.toggleStatsPanel} ${toggleBtnStyle()}`}
                onClick={() => setStatsExpanded(!statsExpanded)}>
                <MdOutlineExpandMore />
            </div>

            <div className={styles.statsPanel}>
                <div className={styles.roomTop}>
                    <div className={styles.backHome}>
                        <Link href="/room">
                            <MdHome />
                        </Link>
                    </div>
                    <div className={styles.roomId}>
                        {roomData.name} {roomData.guest ? "" : ` | ${roomData.id}`}
                    </div>
                    <div className={styles.roomOptionsOuter}>
                        {
                            !roomData.guest && userInRoom()  ?
                            <Requests /> : null
                        }
                        <ThemePicker />
                        {
                            !roomData.guest && userInRoom() ?
                            <VisibilityControl /> : null
                        }
                        <div className={styles.socialLink}>
                            <Link href="/social">
                                <BsFillPeopleFill/>
                            </Link>

                            {
                                showNewsLetter ?
                                <Popup onClose={() => setShowSocialNotif(false)}>
                                    <NewsletterSignup onClose={() => setShowSocialNotif(false)}/>
                                </Popup> : null
                            }
                        </div>
                        {
                            roomData.guest || userInRoom()  ?
                            <div
                                onClick={() => setShowTutorial(true)} 
                                className={styles.showTutorial}>
                                <FaQuestionCircle/>
                            </div> : null
                        }
                        {
                            !roomData.guest && userInRoom() ?
                            <div
                                onClick={() => setShowSettings(true)}  
                                className={styles.showSettings}>
                                <BsGearFill />
                            </div> : null
                        }
                    </div>
                </div>
                <div className={deepWorkStyle()}>
                    
                    <div className={styles.thisWeek}>
                        week of {weekOf()}
                        <script>
                        /*
                        <div className={styles.changeWeek}>
                            <div className={styles.changeWeekButton}>
                                <IoChevronBackCircle/>
                            </div>
                            <div className={styles.changeWeekButton}>
                                <IoChevronForwardCircle/>
                            </div>
                        </div>
                        */
                        </script>
                        <CheckIn />
                    </div>

                    <WorkGrid />

                    <DeepWorkButtons />

                </div>

            </div>
                
            {
                showTutorial ?
                <Popup onClose={() => setShowTutorial(false)}>
                    <Tutorial onClose={() => setShowTutorial(false)}/>
                </Popup> : null
            }

            {
                showSettings ?
                <Popup onClose={() => setShowSettings(false)}>
                    <Settings onClose={() => setShowSettings(false)}/>
                </Popup> : null
            }
        </div>
    )
}
export default StatsPanel;
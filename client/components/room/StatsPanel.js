import styles from '../../styles/room/statspanel.module.scss';

import Requests from './Requests';
import ThemePicker from '../ThemePicker';
import WorkGrid from './WorkGrid';
import DeepWorkButtons from './DeepWorkButtons';
import { BsFillPeopleFill } from "react-icons/bs";

import {useContext, useState, useEffect} from 'react';
import RoomContext from '../../contexts/RoomContext';

import { MdOutlineExpandMore } from "react-icons/md";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { IoMdBackspace } from "react-icons/io";
import Link from 'next/link';
import CheckIn from './CheckIn';
import VisibilityControl from './VisibilityControl';
import Popup from '../Popup';

function StatsPanel() {

    const {roomData} = useContext(RoomContext);
    const [statsExpanded, setStatsExpanded] = useState(true);

    const [showSocialNotif, setShowSocialNotif] = useState(false);

    useEffect(() => {
        const seenSocial = localStorage.getItem('shovel:seenSocial');
        if (!seenSocial || seenSocial === 'false') {
            setShowSocialNotif(true);
            localStorage.setItem('shovel:seenSocial', 'true');
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

    return(
        <div 
            className={`${styles.statsPanelOuter} ${collapsedStyle()}`}>
            <div 
                className={`${styles.toggleStatsPanel} ${toggleBtnStyle()}`}
                onClick={() => setStatsExpanded(!statsExpanded)}>
                <MdOutlineExpandMore />
            </div>

            <div className={styles.statsPanel}>
                <div className={styles.roomTop}>
                    <div className={styles.backHome}>
                        <Link href="/room">
                            <IoMdBackspace />
                        </Link>
                    </div>
                    <div className={styles.roomId}>
                        {roomData.name} {roomData.guest ? "" : ` | ${roomData.id}`}
                    </div>
                    {
                        !roomData.guest ?
                        <Requests /> : null
                    }
                    <ThemePicker />
                    {
                        !roomData.guest ?
                        <VisibilityControl /> : null
                    }
                    <div className={styles.socialLink}>
                        <Link href="/social">
                            <BsFillPeopleFill/>
                        </Link>

                        {
                            showSocialNotif ?
                            <Popup onClose={() => setShowSocialNotif(false)}>
                                <div className={styles.socialNotif}>
                                    Liking shovel? Visit the forum to leave a comment, suggest a new feature, or ask anything! Click the People icon in the top left of the workspace to visit.
                                </div>
                            </Popup> : null
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
        </div>
    )
}
export default StatsPanel;
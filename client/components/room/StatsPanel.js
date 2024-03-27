import styles from '../../styles/room/statspanel.module.scss';

import Requests from './Requests';
import ThemePicker from './ThemePicker';
import WorkGrid from './WorkGrid';
import DeepWorkButtons from './DeepWorkButtons';

import {useContext, useState} from 'react';
import RoomContext from '../../pages/RoomContext';

import { MdOutlineExpandMore } from "react-icons/md";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { IoMdBackspace } from "react-icons/io";
import { TbShovel } from "react-icons/tb";
import Link from 'next/link';

function StatsPanel() {

    const {roomData} = useContext(RoomContext);
    const [statsExpanded, setStatsExpanded] = useState(true);

    const collapsedStyle = () => (
        statsExpanded ? "" : styles.statsPanelCollapsed
    )

    const toggleBtnStyle = () => (
        statsExpanded ? "" : styles.toggleStatsPanelCollapsed
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
                        {roomData.name} | {roomData.id}
                    </div>
                    <Requests />
                    <ThemePicker />
                </div>
                <div className={styles.deepWorkWeek}>
                    
                    <div className={styles.thisWeek}>
                        week of {weekOf()}
                        <div className={styles.changeWeek}>
                            <div className={styles.changeWeekButton}>
                                <IoChevronBackCircle/>
                            </div>
                            <div className={styles.changeWeekButton}>
                                <IoChevronForwardCircle/>
                            </div>
                        </div>
                        <div className={styles.checkInButton}>
                            <TbShovel /> Check In Today
                        </div>
                    </div>

                    <WorkGrid />

                    <DeepWorkButtons />

                </div>
            </div>
        </div>
    )
}
export default StatsPanel;
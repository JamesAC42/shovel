import styles from '../../styles/room/statspanel.module.scss';

import Requests from './Requests';
import ThemePicker from './ThemePicker';
import WorkGrid from './WorkGrid';

import {useContext, useState} from 'react';
import RoomContext from '../../pages/RoomContext';

import { MdOutlineExpandMore } from "react-icons/md";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { TbCircleFilled, TbShovel } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";

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

                    <div className={styles.workButtons}>
                        <div className={styles.addButtons}>
                            <div className={styles.workButton}>
                                <span className={styles.workMarker}><TbCircleFilled/></span>
                            </div>
                            <div className={styles.workButton}>
                                <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                            </div>
                        </div>
                        <div className={styles.undoButton}>
                            <div className={styles.workButton}>
                                <span className={styles.undoButton}><FaUndo /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default StatsPanel;
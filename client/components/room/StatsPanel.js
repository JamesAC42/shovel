import styles from '../../styles/room/statspanel.module.scss';

import Requests from './Requests';
import ThemePicker from '../ThemePicker';
import WorkGrid from './WorkGrid';
import DeepWorkButtons from './DeepWorkButtons';
import { BsFillPeopleFill } from "react-icons/bs";

import {useContext, useState, useEffect, useRef} from 'react';
import RoomContext from '../../contexts/RoomContext';
import UserContext from "../../contexts/UserContext";

import { MdOutlineExpandMore } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { BsGearFill } from "react-icons/bs";
import { PiTimerFill } from "react-icons/pi";
import { SlNotebook } from "react-icons/sl";
import { MdHome } from "react-icons/md";
import Link from 'next/link';
import CheckIn from './CheckIn';
import VisibilityControl from './VisibilityControl';
import Popup from '../Popup';
import NewsletterSignup from '../NewsletterSignup';
import Tutorial from './Tutorial';
import Settings from './Settings';
import TimerSettings from './TimerSettings';
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { FaRegCircle, FaCircle } from "react-icons/fa";
import Timer from './Timer';
import UpdateAnnouncement from '../announcements/UpdateAnnouncement';

const announcementKey = "shovel:seenUpdate020224";

function StatsPanel({activeView}) {

    const {roomData} = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);
    const [statsExpanded, setStatsExpanded] = useState(true);

    const [showTutorial, setShowTutorial] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showTimerSettings, setShowTimerSettings] = useState(false);

    const [showAnnouncement, setShowAnnouncement] = useState(false);

    const [activeStatsView, setActiveStatsView] = useState(0);
    const numSections = 2;
    const [statsInnerHeight, setStatsInnerHeight] = useState(0);
    const statsInnerRef = useRef(null);

    useEffect(() => {
        const updateHeight = () => {
            if (statsInnerRef.current && window.innerWidth > 900) {
                let height = statsInnerRef.current.clientHeight;
                height = Math.max(height, 150);
                setStatsInnerHeight(height / numSections);
            } else {
                setStatsInnerHeight(window.innerHeight);
            }
        };

        // Update height immediately
        updateHeight();

        // Set up a small delay to allow for any async rendering
        const timeoutId = setTimeout(updateHeight, 100);

        // Add window resize event listener
        window.addEventListener('resize', updateHeight);

        // Clean up
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateHeight);
        };
    }, [roomData]);

    useEffect(() => {
        const storageSeenAnnouncement = localStorage.getItem(announcementKey);
        if (!storageSeenAnnouncement || storageSeenAnnouncement === 'false') {
            setShowAnnouncement(true);
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

    const renderPageIndicators = () => {
        let circles = [];
        for(let i = 0; i < numSections; i++) {
            circles.push(
            <div
                onClick={() => setActiveStatsView(i)}
                className={styles.pageItem}>
                <FaRegCircle/>
            </div>
            );
        }
        return circles;
    }

    const incrementStatsView = () => {
        setActiveStatsView(prevView => Math.min(prevView + 1, numSections - 1));
    }

    const decrementStatsView = () => {
        setActiveStatsView(prevView => Math.max(prevView - 1, 0));
    }

    if(showAnnouncement && userInfo) {
        localStorage.setItem(announcementKey, 'true');
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
                        {
                            roomData.guest || userInRoom() ?
                            <div
                                onClick={() => setShowTimerSettings(true)} 
                                className={styles.showTimerSettings}>
                                <PiTimerFill />
                            </div> : null
                        }
                        <div className={styles.paymentLink}>
                            <a href="https://ko-fi.com/shovelproductivity" target="_blank">
                                <RiMoneyDollarBoxFill />
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className={styles.statsPanelContent}>
                    {
                        roomData.guest || userInRoom() ?
                        <div className={styles.statsPanelToggle}>
                            <div
                                onClick={() => decrementStatsView()} 
                                className={styles.statsArrow}>
                            <FiChevronUp/>
                            </div>
                            <div className={styles.pageIndicators}>
                                {renderPageIndicators()}
                                <div
                                    style={{
                                        transform:`translateY(${activeStatsView * 100}%)`
                                    }}
                                    className={styles.pageIndicatorSlider}>
                                    <FaCircle/>
                                </div>
                            </div>
                            <div
                                onClick={() => incrementStatsView()} 
                                className={styles.statsArrow}>
                            <FiChevronDown/>
                            </div>
                        </div> : null
                    }
                    <div
                        style={{height: `${statsInnerHeight}px`}}
                        className={styles.statsPanelWindow}>
                        <div
                            style={{
                                transform:`translateY(-${(100 / numSections) * activeStatsView}%)`
                            }} 
                            ref={statsInnerRef}
                            className={styles.statsPanelInner}>
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
                            <div className={styles.timerOuter}>
                                <Timer showSettings={() => setShowTimerSettings(true)}/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.noteBookButton}>
                        <a href={"https://notes.ovel.sh/room/" + roomData.id}><SlNotebook/> Notebook</a>
                    </div>
                </div>

            </div>
                
            {
                showAnnouncement ?
                <Popup onClose={() => setShowAnnouncement(false)}>
                    <UpdateAnnouncement onClose={() => setShowAnnouncement(false)}/>
                </Popup> : null
            }
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

            {
                showTimerSettings ?
                <Popup onClose={() => setShowTimerSettings(false)}>
                    <TimerSettings onClose={() => setShowTimerSettings(false)}/>
                </Popup> : null
            }
        </div>
    )
}
export default StatsPanel;
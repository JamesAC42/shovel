import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/roomlayout.module.scss';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import Image from 'next/image';

import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { TbCircleFilled, TbShovel } from "react-icons/tb";
import { MdOutlineExpandMore } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { FaUndo, FaSave, FaEraser, FaCheck  } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import { IoMailUnread, IoMail } from "react-icons/io5";
import { CgCloseO } from "react-icons/cg";

export default function Room () {

    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [week, setWeek] = useState(null);

    const [statsExpanded, setStatsExpanded] = useState(true);

    const [showRequests, setShowRequests] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {

        if(!id) return;

        try {
            const response = await fetch(`/api/roomData?id=${id}`);
            const data = await response.json();
            // handle the data object here
            console.log(data);
            if(!data.success) {
                Router.push("/room");
                return;
            } else {
                setData(data.data);
                setLoading(false);
            }
        } catch(err) {
            console.log("Error", err);
            return {
                props: {
                    roomData:null,
                },
            };
        }
    }

    useEffect(() => {
        if(!data) return;

        let date = new Date();
        date.setDate(date.getDate() - date.getDay());
        let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        setWeek(formattedDate);

    }, [data]);
    
    if(loading) return <div>Loading....</div>
    if(!data) return <div>Room not found</div>

    return (
        <div>
            <Head>
                <title>Shovel - Room</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className={styles.roomOuter}>

                <div className={styles.statsPanelOuter + " " + (
                    statsExpanded ? "" : styles.statsPanelCollapsed
                )}>
                <div 
                    className={styles.toggleStatsPanel + " " + (
                        statsExpanded ? "" : styles.toggleStatsPanelCollapsed
                    )} 
                    onClick={() => setStatsExpanded(!statsExpanded)}>
                    <MdOutlineExpandMore />
                </div>
                <div className={styles.statsPanel}>
                    
                    <div className={styles.roomTop}>
                        <div className={styles.roomId}>
                            {data.name} | {id}
                        </div>
                        <div className={styles.requestNotifs}>
                            <div onClick={() => setShowRequests(!showRequests)}>
                                <IoMailUnread />
                            </div>
                            {
                            showRequests ? 
                            <div className={styles.requests}>
                                <h4>join requests</h4>
                                <div className={styles.request}>
                                    <div className={styles.requestName}>
                                        User 1
                                    </div>
                                    <div className={styles.requestActions}>
                                        <div className={styles.approveRequest}>
                                            <FaCheck/>
                                        </div>
                                        <div className={styles.declineRequest}>
                                            <CgCloseO />
                                        </div>
                                    </div>
                                </div>
                            </div> : null
                            }
                        </div>
                    </div>
                    <div className={styles.deepWorkWeek}>
                        <div className={styles.thisWeek}>
                            week of {week}
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
                        <div className={styles.workGrid}>
                            <table>
                                <tr>
                                    <td></td>
                                    <td className={styles.streakHeader}>streak</td>
                                    <td>sunday</td>
                                    <td>monday</td>
                                    <td>tuesday</td>
                                    <td>wednesday</td>
                                    <td>thursday</td>
                                    <td>friday</td>
                                    <td>saturday</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>user 1</td>
                                    <td>
                                        <span className={`${styles.streak} ${styles.streakActive}`}>30/52</span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                                <tr>
                                    <td>user 2</td>
                                    <td>
                                        <span className={styles.streak}>0/12</span>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                                <tr>
                                    <td>user 3</td>
                                    <td>
                                        <span className={styles.streak}>0/8</span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                                <tr>
                                    <td>user 3</td>
                                    <td>
                                        <span className={styles.streak}>0/8</span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                                <tr>
                                    <td>user 3</td>
                                    <td>
                                        <span className={styles.streak}>0/8</span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                                <tr>
                                    <td>user 3</td>
                                    <td>
                                        <span className={styles.streak}>0/8</span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                        <span className={styles.workMarker}><TbCircleFilled/></span>
                                    </td>
                                    <td>
                                        <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                                    </td>
                                    <td><span className={styles.workTotal}>10</span></td>
                                </tr>
                            </table>
                        </div>
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
                
                <div className={styles.mainContentOuter}>
                <div className={styles.mainContent}>
                    
                    <div className={styles.todoOuter}>
                        
                        <div className={styles.userTabPanel}>
                            <div className={`${styles.userTab} ${styles.userTabActive}`}>User 2 asdf asdf</div>
                            <div className={styles.userTab}>James C</div>
                            <div className={styles.userTab}>James C</div>
                            <div className={styles.userTab}>Enis A</div>
                            <div className={styles.userTab}>User 2 asdf asdf</div>
                            <div className={styles.userTab}>User 2 asdf asdf</div>
                            <div className={styles.panelFiller}></div>
                        </div>
                        <div className={styles.todoInner}>
                            <div className={styles.goalSection}>
                                <h2>Goal <span className={styles.goalDates}>3/3/2024-</span></h2>
                                <div className={styles.taskList}>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this asdlkfj;al sdjfkl;a lsdk;fl;alsdfk;alksd jfkl; ;l sdlk;fjasl;d fa;sldkf ja;sldkj f;las dkf;lasj f;laks jdf;lks;lakjdf l;asdjf;lkasdjf;laks jdfl;askd jf;laskdfj ;alskdl;
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={styles.taskItem}>
                                        <div className={`${styles.taskCheck} ${styles.taskCheckDone}`}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>

                                    <div className={styles.taskItem}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={styles.newTaskContainer}>
                                        <input type="text" placeholder="New Task"></input>
                                        <input type="text" placeholder="tag 1, tag2, ..."></input>
                                        <div className={styles.addTask}>
                                            <HiPencilAlt />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.goalSection}>
                                <h2>Goal <span className={styles.goalDates}>3/3/2024-4/4/2024</span></h2>
                                <div className={styles.taskList}>
                                    <div className={styles.taskItem}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={styles.taskItem}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.taskItem} ${styles.taskItemCompleted}`}>
                                        <div className={styles.taskCheck}>
                                        </div>
                                        <div className={styles.taskName}>
                                            Task 1 is to do this
                                            <span className={styles.taskTag}>Tag 1</span>
                                            <span className={styles.taskTag}>Tag 2</span>
                                            <span className={styles.taskTag}>Tag 3</span>
                                        </div>
                                    </div>
                                    <div className={styles.newTaskContainer}>
                                        <input type="text" placeholder="New Task"></input>
                                        <input type="text" placeholder="tag 1, tag2, ..."></input>
                                        <div className={styles.addTask}>
                                            <HiPencilAlt />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.newGoal}>
                                <input type="text" placeholder="New Goal"></input>
                                <div className={styles.addGoal}>
                                    <HiPencilAlt />
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className={styles.journalOuter}>

                        <div className={styles.userTabPanel}>
                            <div className={`${styles.userTab} ${styles.userTabActive}`}>User 1</div>
                            <div className={styles.userTab}>User 2</div>
                            <div className={styles.userTab}>User 3</div>
                            <div className={styles.panelFiller}></div>
                        </div>
                        <div className={styles.journalInner}>

                            <div className={styles.journalDates}>
                                <div className={styles.journalYear}>
                                    2024
                                    <div className={styles.journalYearExpand}>
                                        <MdOutlineExpandMore />
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={`${styles.journalMonth} ${styles.journalMonthActive}`}>
                                        April
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        February
                                    </div>
                                    <div className={styles.journalMonth}>
                                        January
                                    </div>
                                </div>
                                <div className={styles.journalYear}>
                                    2024
                                    <div className={styles.journalYearExpand}>
                                        <MdOutlineExpandMore />
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        April
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        February
                                    </div>
                                    <div className={styles.journalMonth}>
                                        January
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        April
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        February
                                    </div>
                                    <div className={styles.journalMonth}>
                                        January
                                    </div>
                                </div>
                                <div className={styles.journalYear}>
                                    2024
                                    <div className={styles.journalYearExpand}>
                                        <MdOutlineExpandMore />
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={`${styles.journalMonth} ${styles.journalMonthActive}`}>
                                        April
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        February
                                    </div>
                                    <div className={styles.journalMonth}>
                                        January
                                    </div>
                                </div>
                                <div className={styles.journalYear}>
                                    2024
                                    <div className={styles.journalYearExpand}>
                                        <MdOutlineExpandMore />
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={`${styles.journalMonth} ${styles.journalMonthActive}`}>
                                        April
                                    </div>
                                    <div className={styles.journalMonth}>
                                        March
                                    </div>
                                    <div className={styles.journalMonth}>
                                        February
                                    </div>
                                    <div className={styles.journalMonth}>
                                        January
                                    </div>
                                </div>
                            </div>
                            <div className={styles.journalContent}>
                                <h2>Journal</h2>

                                <div className={styles.journalInputContainer}>

                                    <div className={styles.journalInputTextOuter}>
                                        <textarea className={styles.journalInputMain} placeholder="What's new today..."></textarea>
                                        <textarea className={styles.journalInputTags} placeholder="tag 1, tag 2, ..."></textarea>
                                    </div>
                                    <div className={styles.journalInputControls}>
                                        
                                        <div className={styles.journalInputControl}>
                                            <FaSave />
                                        </div>
                                        <div className={styles.journalInputControl}>
                                            <FaUndo />
                                        </div>
                                        <div className={styles.journalInputControl}>
                                            <FaEraser />
                                        </div>
                                        <div className={styles.journalInputControl}>
                                            <FaFileArrowUp />
                                        </div>

                                    </div>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>
                                        March 3rd, 2025 
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                    </h3>
                                    <p>
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>
                                        March 3rd, 2025 
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                    </h3>
                                    <p>
                                        
                                    asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk jk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        ;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;l
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>
                                        March 3rd, 2025 
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                    </h3>
                                    <p>

                                    asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>February 23rd, 2024</h3>

                                    <p>

                                    asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>February 23rd, 2024</h3>

                                    <p>

                                    asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                                
                                <div className={styles.journalEntry}>
                                    <h3>
                                        March 3rd, 2025 
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                        <span className={styles.journalTag}>Tag 1</span>
                                    </h3>

                                    <p>

                                    asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                        asdf asdf asl;dkfj;laksdj f;lk  lkja;sld aslkd ;las k;lk j;lkj 
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                
                </div>
                </div>

            </div>

        </div>
    )
}
import { useRouter } from 'next/router';
import styles from '../../styles/roomlayout.module.scss';
import { useEffect, useState } from 'react';
import Router from 'next/router';

import { MdOutlineExpandMore } from "react-icons/md";
import { HiPencilAlt } from "react-icons/hi";
import { FaUndo, FaSave, FaEraser } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";

import StatsPanel from '../../components/room/StatsPanel';

import RoomContext from '../RoomContext';

export default function Room () {

    const router = useRouter();
    const { id } = router.query;

    const [roomData, setRoomData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {

        if(!id) return;

        setLoading(true);

        try {
            const response = await fetch(`/api/roomData?id=${id}`);
            const data = await response.json();
            console.log(data);
            if(!data.success) {
                Router.push("/room");
                return;
            } else {
                setRoomData(data.data);
            }
        } catch(err) {
            console.log("Error", err);
            return {
                props: {
                    roomData:null,
                },
            };
        }

        setLoading(false);
    }
    
    if(loading) return <div>Loading....</div>
    if(!roomData) return <div>Room not found</div>

    return (
        <RoomContext.Provider value={{roomData, setRoomData}}>
        <div>
            
            <div className={styles.roomOuter}>

                <StatsPanel/>
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
        </RoomContext.Provider>
    )
}
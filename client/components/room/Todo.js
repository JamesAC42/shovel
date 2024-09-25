import UserTabs from './UserTabs';
import RoomContext from '../../contexts/RoomContext';
import UserContext from "../../contexts/UserContext";
import styles from '../../styles/room/todo.module.scss';
import { HiPencilAlt } from "react-icons/hi";
import { useContext, useState, useEffect } from 'react';
import { FaArrowDownLong } from "react-icons/fa6";
import Goal from './Goal';
import getToday from '../../utilities/getToday';
import DraggableGoals from './sortable/DraggableGoals';
import { FaTrashAlt, FaArchive, FaBoxOpen } from 'react-icons/fa';

import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";

function Todo({todoCollapsed, journalCollapsed, onCollapsed, isGuest}) {

    const { roomData, setRoomData } = useContext(RoomContext);
    const { userInfo } = useContext(UserContext);

    let [activeTab, setActiveTab] = useState(null);
    let [goalInput, setGoalInput] = useState("");
    let [showArchived, setShowArchived] = useState(false); // Added state variable
    const [hasArchivedGoals, setHasArchivedGoals] = useState(false);

    const getGoals = () => {

        if(!roomData || !activeTab) return {};
        if(!userInfo && !roomData.guest) return {};
        if(!roomData.users[activeTab]) return {};
        let goals = roomData.users[activeTab].goals;
        // Filter goals based on 'archived' status
        return Object.fromEntries(
            Object.entries(goals).filter(([id, goal]) =>
                showArchived ? goal.archived : !goal.archived
            )
        );

    }

    const noGoals = () => {
        let goals = getGoals();
        if(Object.keys(goals).length > 0) return null;
        return(
            <div className={styles.noGoals}>
                {
                    showNewGoal() ?
                    <>
                    Add a new goal <FaArrowDownLong />
                    </> : "No goals yet"
                }
            </div>
        )
    }

    const addGoal = async () => {

        if(!goalInput) return;
        if(goalInput.length > 100) return;
        if(!roomData?.id) return;

        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            let goalIDs = Object.keys(newData.users[1].goals).map((k) => parseInt(k)).sort();
            let newID = goalIDs.length > 0 ? goalIDs[goalIDs.length - 1] + 1 : 1;
            newData.users[1].goals[newID] = {
                id: newID,
                startDate: getToday(),
                endDate: null,
                status: "",
                title: goalInput,
                description: goalInput,
                tasks: []
            }

            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);
            setGoalInput("");

        } else {

            try {
                const today = getToday();
                const response = await fetch('/api/addGoal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ goal: goalInput, room: roomData.id, date:today }),
                });
                const data = await response.json();
                if (!data.success) {
                    console.error(data.message);
                } else {
                    setGoalInput("");
                }
            } catch(err) {
                console.error(err);
            }
        }


    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            addGoal();
        }
    }

    const showNewGoal = () => {
        if(!userInfo && !roomData.guest) return false;
        if (showArchived) return false;
        if(roomData.guest) return true;
        return activeTab === userInfo.id;
    }

    const userInRoom = () => {
        if(!roomData) return false;
        if(!userInfo) return false;
        if(!roomData.users[userInfo.id]) return false;
        return true;
    }

    const oneUserInRoom = () => {
        if(!roomData) return false;
        return Object.keys(roomData.users).length === 1;
    }

    useEffect(() => {
        
        if(!roomData) return;
        if(!activeTab) {
            if(userInfo && !roomData.guest && userInRoom()) {
                setActiveTab(userInfo.id);
            } else {
                setActiveTab(parseInt(Object.keys(roomData.users)[0]));
            }
        }
    
    }, [roomData]);

    useEffect(() => {
        let goals = roomData.users[activeTab]?.goals;
        if(!goals) return;
        const archivedGoalsExist = Object.values(goals).some(goal => goal.archived);
        setHasArchivedGoals(archivedGoalsExist);
    }, [roomData, activeTab]);

    if(!roomData) return null;

    let goals = Object.values(getGoals());
    goals = goals.sort((a, b) => {
        if(isNaN(a.order) || isNaN(b.order)) return 0;
        return a.order - b.order;
    });
    return (
        <div className={`${styles.todoOuter} ${todoCollapsed ? styles.collapsed : ''} ${journalCollapsed ? styles.expanded : ''}`}>
                        
            {
                todoCollapsed ?
                <div className={styles.expandButton} onClick={() => onCollapsed(!todoCollapsed)}>
                    <TbLayoutSidebarRightCollapseFilled />
                </div> : null
            }

            {
                (isGuest || oneUserInRoom()) && !todoCollapsed ?
                <div className={styles.collapseButton} onClick={() => onCollapsed(!todoCollapsed)}>
                    <TbLayoutSidebarLeftCollapseFilled />
                </div> : null
            }

            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setActiveTab(parseInt(userId))}
                collapseDirection={'left'}
                onCollapse={() => onCollapsed(!todoCollapsed)}/>

            <div className={styles.todoInner}>

                {(showArchived || (hasArchivedGoals && !todoCollapsed)) && (
                    <div className={styles.toggleArchived}>
                        <button onClick={() => setShowArchived(!showArchived)}>
                            {showArchived ? <FaArchive /> : <FaBoxOpen />}
                            {showArchived ? 'Show Active Goals' : 'Show Archived Goals'}
                        </button>
                    </div>
                )}

                { noGoals() }
                {
                    <DraggableGoals activeTab={activeTab} goals={goals}/>
                }

                { 
                    showNewGoal() ? 
                    <div className={styles.newGoal}>
                        <input
                            onChange={(e) => setGoalInput(e.target.value)}
                            value={goalInput} 
                            maxLength={100}
                            onKeyDown={(e) => handleKeyDown(e)}
                            type="text" placeholder="New Goal"></input>
                        <div
                            onClick={() => addGoal()} 
                            className={styles.addGoal}>
                            <HiPencilAlt />
                        </div>
                    </div> : null
                }

            </div>

        </div>
    )
}
export default Todo;
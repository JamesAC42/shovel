import UserTabs from './UserTabs';
import RoomContext from '../../contexts/RoomContext';
import UserContext from "../../contexts/UserContext";
import styles from '../../styles/room/todo.module.scss';
import { HiPencilAlt } from "react-icons/hi";
import { useContext, useState, useEffect } from 'react';
import { FaArrowDownLong } from "react-icons/fa6";
import Goal from './Goal';
import getToday from '../../utilities/getToday';

function Todo() {

    const { roomData, setRoomData } = useContext(RoomContext);
    const { userInfo } = useContext(UserContext);

    let [activeTab, setActiveTab] = useState(null);
    let [goalInput, setGoalInput] = useState("");

    const getGoals = () => {

        if(!roomData || !activeTab) return {};
        if(!userInfo && !roomData.guest) return {};
        return roomData.users[activeTab].goals;

    }

    const generateGoal = (goalId) => {
        let goal = getGoals()[goalId];
        return goal;
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
        if(roomData.guest) return true;
        return activeTab === userInfo.id;
    }

    useEffect(() => {
        
        if(!roomData) return;
        if(!activeTab) {
            if(userInfo && !roomData.guest) {
                setActiveTab(userInfo.id);
            } else {
                setActiveTab(parseInt(Object.keys(roomData.users)[0]));
            }
        }
    
    }, [roomData]);

    if(!roomData) return null;

    return (
        <div className={styles.todoOuter}>
                        
            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setActiveTab(parseInt(userId))}/>

            <div className={styles.todoInner}>

                { noGoals() }
                {
                    Object.keys(getGoals()).map((goalId) => <Goal key={goalId} activeTab={activeTab} goalItem={generateGoal(goalId)}/>)
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
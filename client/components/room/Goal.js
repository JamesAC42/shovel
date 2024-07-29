import Task from "./Task";
import styles from '../../styles/room/todo.module.scss';
import { HiPencilAlt } from "react-icons/hi";
import dateToReadable from "../../utilities/dateToReadable";
import {useState, useContext, useRef} from 'react';
import { FaTrashAlt } from "react-icons/fa";
import getToday from "../../utilities/getToday";
import RoomContext from "../../contexts/RoomContext";
import UserContext from "../../contexts/UserContext";

function Goal({activeTab, goalItem}) {

    /*
    goalsData[goal.id] = {
        title: goal.title,
        description: goal.description,
        startDate: goal.startDate,
        endDate: goal.endDate,
        goalStatus: goal.status,
        tasks: [
            {
                id: task.id,
                title: task.title,
                description: task.description,
                dateCreated: task.dateCreated,
                dateCompleted: task.dateCompleted,
                tags: [] 
            }
        ]
    };
    */
    let { roomData, setRoomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);

    let [showDelete, setShowDelete] = useState(false);

    let [taskValue, setTaskValue] = useState("");
    let [tagValue, setTagValue] = useState("");

    const inputRef = useRef();

    const deleteGoal = async () => {

        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            delete newData.users[1].goals[goalItem.id];
            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);

        } else {
            const response = await fetch('/api/deleteGoal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ goal: goalItem.id }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            }
        }
    }

    const addTask = async () => {

        if(!roomData) return;
        if(!goalItem?.id) return;

        if(!taskValue) return;
        if(taskValue.length === 0 || taskValue.length > 100) return;

        let tags = tagValue.split(',');
        tags = 
            tags
                .filter(tag => tag.trim() !== "" && tag.length <= 50)
                .map(tag => tag.trim());
        
        let filteredTags = [];
        for(let tag of tags) {
            if(filteredTags.indexOf(tag) === -1) {
                filteredTags.push(tag);
            }
        }

        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            let taskIDs = newData.users[1].goals[goalItem.id].tasks.map((t) => t.id).sort();
            let nextID = taskIDs.length > 0 ? taskIDs[taskIDs.length - 1] + 1 : 1;
            let newTask = {
                id: nextID,
                title: taskValue,
                description: taskValue,
                dateCreated: getToday(),
                dateCompleted: null,
                tags: filteredTags, 
            }
            newData.users[1].goals[goalItem.id].tasks.push(newTask);
            newData.users[1].goals[goalItem.id].endDate = null;
            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);

        } else {

            const response = await fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    room: roomData.id,
                    task: taskValue,
                    date: getToday(),
                    goal: goalItem.id,
                    tags: filteredTags
                }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
                return;
            }
        }

        setTaskValue("");
        setTagValue("");
        if(inputRef.current) {
            inputRef.current.focus();
        }


    }

    const handleKeyPress = (e) => { 
        if (e.key === 'Enter') {
            addTask();
        }
    }

    const toggleDelete = (show) => {
        if(!userInfo && !roomData.guest) return;
        if(roomData.guest || (activeTab === userInfo.id)) {
            setShowDelete(show);
        }
    }

    const showNewTask = () => {
        if(!userInfo && !roomData.guest) return null;
        if(roomData.guest) return true;
        return userInfo.id === activeTab;
    }

    let {
        id,
        title,
        description,
        startDate,
        endDate,
        goalStatus,
        tasks
    } = goalItem;

    return(
        <div className={`${styles.goalSection} ${endDate ? styles.goalCompleted : ''}`}>
            <div
                className={styles.goalHeader}
                onMouseEnter={() => toggleDelete(true)}
                onMouseLeave={() => toggleDelete(false)}
                onTouchStart={() => toggleDelete(true)}
                onTouchEnd={() => toggleDelete(false)}>

                <div
                    className={styles.goalTitle}>
                    <div
                        onClick={() => deleteGoal()} 
                        onTouchEnd={(e) => {
                            deleteGoal();
                            e.stopPropagation();
                        }}
                        className={`${styles.deleteGoal} ${showDelete ? styles.deleteGoalShow : ''}`}>
                        <FaTrashAlt />
                    </div>
                    <div className={styles.goalTitleText}>
                        {title + " "}
                    </div>
                </div>
                <div className={styles.goalDates}>
                    {dateToReadable(startDate)}-{dateToReadable(endDate)}
                </div>
            </div>
            <div className={styles.taskList}>
                {
                    tasks.length === 0 ?
                    <div className={styles.noTasks}>
                        No tasks yet
                    </div> : null
                }
                {
                    tasks.map((task) =>
                        <Task key={task.id} activeTab={activeTab} goal={id} taskItem={task}/>
                    )
                }
                {
                    showNewTask() ?
                    <div className={styles.newTaskContainer}>
                        <input
                            ref={inputRef}
                            onChange={(e) => setTaskValue(e.target.value)}
                            value={taskValue}
                            onKeyDown={(e) => handleKeyPress(e)} 
                            maxLength={100}
                            type="text" 
                            placeholder="New Task"></input>
                        <input
                            onChange={(e) => setTagValue(e.target.value)}
                            value={tagValue}
                            onKeyDown={(e) => handleKeyPress(e)} 
                            type="text" 
                            placeholder="tag 1, tag 2, ..."></input>
                        <div
                            onClick={() => addTask()} 
                            className={styles.addTask}>
                            <HiPencilAlt />
                        </div>
                    </div> : null
                }
            </div>
        </div>
    )
}
export default Goal;
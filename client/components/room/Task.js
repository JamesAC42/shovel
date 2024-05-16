import styles from '../../styles/room/todo.module.scss';
import { FaTrashAlt } from "react-icons/fa";
import {useState, useContext} from 'react';
import UserContext from "../../contexts/UserContext";
import RoomContext from "../../contexts/RoomContext";
import getToday from '../../utilities/getToday';
import { FaCheck } from "react-icons/fa6";

function Task({goal, activeTab, taskItem}) {

    /*
    {
        id: task.id,
        title: task.title,
        description: task.description,
        dateCreated: task.dateCreated,
        dateCompleted: task.dateCompleted,
        tags: [] 
    }
    */

    let { userInfo } = useContext(UserContext);
    let { roomData, setRoomData } = useContext(RoomContext);
    let [showDelete, setShowDelete] = useState(false);

    const deleteTask = async () => {
        
        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            let index;
            let latestDate;
            let latestTime = 0;
            let incompleteRemaining = false;
            for(let i = 0; i < newData.users[1].goals[goal].tasks.length; i++) {
                let task = newData.users[1].goals[goal].tasks[i];
                if(task.id === taskItem.id) {
                    index = i;
                } else {
                    if(!task.dateCompleted) {
                        incompleteRemaining = true;
                    } else {
                        let time = new Date(task.dateCompleted).getTime(); 
                        if(time > latestTime) {
                            latestDate = task.dateCompleted;
                            latestTime = time;
                        }
                    }
                }
            }
            if(!incompleteRemaining) {
                newData.users[1].goals[goal].endDate = latestDate;
            }
            newData.users[1].goals[goal].tasks.splice(index, 1);
            if(latestDate) {

            }
            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);

        } else {

            const response = await fetch('/api/deleteTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    room: roomData.id,
                    goal,
                    task: taskItem.id
                }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            }
        }

    }

    const toggleTask = async () => {

        if(!userInfo && !roomData.guest) return;
        let userId = roomData.guest ? 1 : userInfo.id;
        if(activeTab !== userId) return;

        if(roomData.guest) {

            let newData = JSON.parse(JSON.stringify(roomData));
            let index;
            let latestDate;
            let latestTime = 0;
            let incompleteRemaining = false;
            for(let i = 0; i < newData.users[1].goals[goal].tasks.length; i++) {
                let task = newData.users[1].goals[goal].tasks[i];
                if(task.id === taskItem.id) {
                    index = i;
                } else {
                    if(!task.dateCompleted) {
                        incompleteRemaining = true;
                    } else {
                        let time = new Date(task.dateCompleted).getTime(); 
                        if(time > latestTime) {
                            latestDate = task.dateCompleted;
                            latestTime = time;
                        }
                    }
                }
            }
            if(newData.users[1].goals[goal].tasks[index].dateCompleted) {
                newData.users[1].goals[goal].tasks[index].dateCompleted = null; 
                newData.users[1].goals[goal].endDate = null;
            } else {
                let today = getToday();
                if(!incompleteRemaining) {
                    newData.users[1].goals[goal].endDate = today;
                }
                newData.users[1].goals[goal].tasks[index].dateCompleted = today;
            }
            localStorage.setItem("guest-room", JSON.stringify(newData));
            setRoomData(newData);

        } else {
            const response = await fetch('/api/toggleTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    room: roomData.id,
                    goal,
                    task: taskItem.id,
                    date: getToday()
                }),
            });
            const data = await response.json();
            if (!data.success) {
                console.error(data.message);
            }
        }


    }

    const toggleDelete = (show) => {
        if(!userInfo && !roomData.guest) return;
        if(roomData.guest) {
            setShowDelete(show);
            return;
        }
        if(activeTab === userInfo?.id) {
            setShowDelete(show);
        }
    }

    const editable = () => {
        if(!roomData) return false;
        if(roomData.guest) return true;
        if(!userInfo) return false;
        return activeTab === userInfo.id;
    }

    let {
        title,
        description,
        dateCreated,
        dateCompleted,
        tags
    } = taskItem;

    return(
        <div 
            className={`${styles.taskItem} ${dateCompleted ? styles.taskItemCompleted : ''}`}>
            <div
                onClick={() => toggleTask()} 
                className={`${styles.taskCheck} ${editable() ? styles.taskCheckEditable : ''}`}>
                {
                    dateCompleted ? <FaCheck /> : null
                }
            </div>
            <div
                onMouseEnter={() => toggleDelete(true)}
                onMouseLeave={() => toggleDelete(false)} 
                className={styles.taskName}>
                <div
                    onClick={() => deleteTask()} 
                    className={`${styles.deleteTask} ${showDelete ? styles.showDeleteTask : ''}`}>
                    <FaTrashAlt />
                </div>
                <div>
                {title}
                </div>
                {
                    tags.map(tag =>
                        <span key={tag} className={styles.taskTag}>{tag}</span>
                    )
                }
            </div>
        </div>
    )
}
export default Task;
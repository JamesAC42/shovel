import styles from '../../styles/room/todo.module.scss';
import { FaTrashAlt, FaSave} from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import {useState, useContext} from 'react';
import UserContext from "../../contexts/UserContext";
import RoomContext from "../../contexts/RoomContext";
import getToday from '../../utilities/getToday';
import { FaCheck } from "react-icons/fa6";
import { HiPencilAlt } from "react-icons/hi";

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
    let { roomData } = useContext(RoomContext);
    let [showDelete, setShowDelete] = useState(false);
    let [showEdit, setShowEdit] = useState(false);
    let [editMode, setEditMode] = useState(false);
    let [editedTitle, setEditedTitle] = useState(taskItem.title);

    let deleteTask = async () => { 

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

    const handleEditClick = () => {
        setEditMode(true);
    }

    const editTask = async () => { 

        const response = await fetch('/api/editTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id,
                goal,
                task: taskItem.id,
                title: taskItem.title,
                description: taskItem.description,
                tags: taskItem.tags
            }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }
    }

    const handleSaveClick = () => {
        taskItem.title = editedTitle;
        // taskItem.description = editedDescription;
        editTask();
        setEditMode(false);
    }

    const handleCancelClick = () => {
        setEditedTitle(taskItem.title);
        // setEditedDescription(taskItem.description);
        setEditMode(false);
    }

   

    const toggleTask = async () => {

        if(activeTab !== userInfo.id) return;
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

    const toggleDelete = (show) => {
        if(activeTab === userInfo.id) {
            setShowDelete(show);
            setShowEdit(show);
        }
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
                className={`${styles.taskCheck} ${activeTab === userInfo.id ? styles.taskCheckEditable : ''}`}>
                {
                    dateCompleted ? <FaCheck /> : null
                }
            </div>
            <div
                onMouseEnter={() => toggleDelete(true)}
                onMouseLeave={() => toggleDelete(false)}
                className={styles.taskName}>
            {editMode ? (
                <div className={styles.editModeContainer}>
                    <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className={styles.editModeInput}
                    />

                    <div onClick={handleSaveClick} className={styles.saveEdit}>
                        <FaSave />
                        </div>
                    <div onClick={handleCancelClick} className={styles.cancelEdit}>
                        <TiCancel />
                    </div>
                </div>
            ) : (

                <div className={styles.taskName}>
                <div
                    onClick={handleEditClick}
                    className={`${styles.editTask} ${showEdit ? styles.showEditTask : ''}`}>
                    <HiPencilAlt />
                    </div>
                
            
                <div
                    onClick={() => deleteTask()}
                    className={`${styles.deleteTask} ${showDelete ? styles.showDeleteTask : ''}`}>
                    <FaTrashAlt />
                </div>
                <div
                >
                {taskItem.title}
            </div>
                
            </div>
        )}
            <div>
                    {taskItem.tags.map((tag) => (
                        <span key={tag} className={styles.taskTag}>
                        {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        
    )
}
export default Task;
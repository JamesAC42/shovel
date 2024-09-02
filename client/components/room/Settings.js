import { useState, useContext } from "react";
import styles from "../../styles/room/settings.module.scss";
import RoomContext from '../../contexts/RoomContext';
import { IoCloseCircle } from "react-icons/io5";
import Router from 'next/router';

function Settings({onClose}) {

    const { roomData } = useContext(RoomContext);
    const [newRoomName, setNewRoomName] = useState(roomData.name);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleNameChange = (e) => {
        setNewRoomName(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newRoomName.trim() === "") return;
        if(newRoomName.length > 50) return;
        const response = await fetch('/api/renameRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id,
                newName: newRoomName
             }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
            setError(data.message);
        } else {
            setError("");
            setSuccess("Room name updated successfully.");
            setTimeout(() => {
                setSuccess("");
            },2000);
        }
    }

    const handleLeaveRoom = async () => {
        if(!confirm("Are you sure you want to leave the room? All of your data in this room will be lost.")) return;
        const response = await fetch('/api/leaveRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room: roomData.id }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
            alert("Something went wrong while deleting the room. Please try again.");
        } else {
            Router.push("/room");
        }
    }

    const handleDeleteRoom = async () => {
        if(!confirm("Are you sure you want to delete this room? All of your data in this room will be lost.")) return;
        const response = await fetch('/api/deleteRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room: roomData.id }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
            alert("Something went wrong while deleting the room. Please try again.");
        } else {
            Router.push("/room");
        }
        
    }

    const isOnlyUser = Object.keys(roomData.users).length === 1;

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.settingsContent}>
                <h2>Room Settings</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="roomName">Room Name:</label>
                    <input 
                        type="text" 
                        id="roomName" 
                        value={newRoomName} 
                        onChange={handleNameChange}
                        maxLength={50}
                    />
                    {
                        error ?
                        <div className={styles.error}>{error}</div> : null
                    }
                    {
                        success ?
                        <div className={styles.success}>{success}</div> : null
                    }
                    <button type="submit">Update Room Name</button>
                </form>
                <div className={styles.exitRoomOuter}>
                    {isOnlyUser ? (
                        <button onClick={handleDeleteRoom} className={styles.dangerButton}>Delete Room</button>
                    ) : (
                        <button onClick={handleLeaveRoom} className={styles.dangerButton}>Leave Room</button>
                    )}
                </div>
            </div>
            <div 
                onClick={onClose}
                className={styles.close}>
                <IoCloseCircle/>
            </div>
        </div>
    );

}
export default Settings;
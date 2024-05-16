import styles from "../styles/room.module.scss";
import {useState, useEffect} from 'react';
import Link from 'next/link';
import Router from 'next/router';

export default function EnterRoom({userInfo, setUserInfo}) {

    const [roomId, setRoomId] = useState("");
    const [joinError, setJoinError] = useState("");
    const [joinStatus, setJoinStatus]  = useState("");
    
    const [roomName, setRoomName] = useState("");
    const [createError, setCreateError] = useState("");

    const [userRooms, setUserRooms] = useState([]);

    const [hasGuestRoom, setHasGuestRoom] = useState(false);

    const validateRoom = () => {

        if(roomId.length < 1 || roomId.length > 50) {
            setJoinError("ID is required.");
            return;
        }
        if(isNaN(roomId)) {
            setJoinError("Room ID must be a number.");
            return;
        }
        fetch('/api/joinRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomId
            }),
        })
        .then(response => response.json())
        .then(data => {
            setJoinError("");
            setJoinStatus("");
            if (data.success) {
                Router.push("/room/" + roomId);
                return;
            } else {
                if(data.requestSent) {
                    setJoinStatus("Request to join sent!");
                    return;
                } 
                if(data.alreadyRequested) {
                    setJoinStatus("Request still pending approval.");
                    return;
                }
                setJoinError(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setJoinError(error.toString());
        });
    }

    const createRoom = () => {

        if(roomName.length < 1 || roomName.length > 50) {
            setCreateError("Invalid name.");
            return;
        }
        fetch('/api/createRoom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomName
            }),
        })
        .then(response => response.json())
        .then(data => {
            setCreateError("");
            if (data.success) {
                Router.push("/room/" + data.roomId);
                return;
            } else {
                setCreateError(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setCreateError(error.toString());
        });
    }

    const logout = () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                setUserInfo(null);
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {

        if(!userInfo?.id) {
            setUserRooms([]);
            return;
        }

        fetch('/api/getUserRooms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUserRooms(data.rooms);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }, [userInfo]);

    useEffect(() => {

        if(hasGuestRoom) return;
        const guestData = localStorage.getItem("guest-room");
        if(guestData) {
            setHasGuestRoom(true);
        }

    }, []);

    if (userInfo === null) return;

    let {
        color,
        firstName,
        lastName
    } = userInfo;

    return(
        <div className={styles.loggedIn} style={{borderColor:color}}>
            <div className={styles.accountStatus}>
                logged in as {firstName + ' ' + lastName}
                <div className={styles.logout} onClick={logout}>Log out</div>
            </div>
            <div className={styles.roomInput}>
                <label>
                    Enter Room ID:
                </label>
                <input type="text" value={roomId} maxLength={10} placeholder="Room ID" onChange={e => setRoomId(e.target.value)} />
                <input className={styles.submitForm} type="submit" value="Enter Room" onClick={validateRoom} />
                { 
                    joinError ? 
                    <div className={styles.errorMessage}>
                        {joinError}
                    </div> : null
                }
                {
                    joinStatus ?
                    <div className={styles.joinStatus}>
                        {joinStatus}
                    </div> : null
                }
                {
                    userRooms.length > 0 ?
                    <div className={styles.myRooms}>
                        <label>My Rooms</label>
                        <ul>
                        {
                            userRooms.map((room) =>
                            <li key={room.name}>
                                <Link href={"/room/" + room.id}>
                                    {room.name}
                                </Link>
                            </li>
                            )
                        }
                        </ul>
                    </div> : null
                }
                {
                    hasGuestRoom ?
                    <div className={styles.guestRoomLinkOuter}>
                        <p>You have a guest room:</p>
                        <Link href="/guest" className={styles.guestRoomLink}>
                            Guest Room
                        </Link>
                    </div> : null
                }
            </div>
            <div className={styles.roomInput}>
                <label>
                    Create a New Room:
                </label>
                <input type="text" value={roomName} maxLength={50} placeholder="Room Name" onChange={e => setRoomName(e.target.value)} />
                <input className={styles.submitForm} type="submit" value="Create Room" onClick={createRoom} />
                {
                    createError ?
                    <div className={styles.errorMessage}>
                        {createError}
                    </div> : null
                }
            </div>
        </div>
    )

}
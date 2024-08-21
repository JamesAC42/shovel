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

    const toggleSubscription = () => {
        const apiEndpoint = subscribedEmail ? '/api/unsubscribeNewsletter' : '/api/subscribeNewsletter';
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUserInfo(prev => ({ ...prev, subscribedEmail: !subscribedEmail }));
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

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
        lastName,
        subscribedEmail
    } = userInfo;

    return(
        <div className={styles.loggedIn} style={{borderColor:color}}>
            <div className={styles.accountStatus}>
                <div className={styles.accountInfo}>
                <div className={styles.accountName}>
                logged in as {firstName + ' ' + lastName}
                </div>
                <div className={styles.emailStatus}>
                    {
                        subscribedEmail ? (
                            <>
                                Subscribed to emails
                                <button onClick={toggleSubscription}>Unsubscribe</button>
                            </>
                        ) : (
                            <>
                                Not subscribed to emails
                                <button onClick={toggleSubscription}>Subscribe</button>
                            </>
                        )
                    }
                </div>
                </div>
                <div className={styles.logout} onClick={logout}>Log out</div>
            </div>
            <div className={`${styles.roomInput} ${styles.createNew}`}>
                <label>
                    Create a New Room:
                </label>
                <p>Make a new room to start from scratch. First give it a name, then click Create Room.</p>
                <input type="text" value={roomName} maxLength={50} placeholder="Name the room:" onChange={e => setRoomName(e.target.value)} />
                <input className={styles.submitForm} type="submit" value="Create Room" onClick={createRoom} />
                {
                    createError ?
                    <div className={styles.errorMessage}>
                        {createError}
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
                        <label>You have a guest room:</label>
                        <Link href="/guest" className={styles.guestRoomLink}>
                            Guest Room
                        </Link>
                    </div> : null
                }
            </div>
            <div className={styles.roomInput} id="joinExisting">
                <label>
                    Join an existing room:
                </label>
                <p>Enter the ID of the room you wish to join. The ID is the number in the top left of the room while you're in it.</p>
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
            </div>
        </div>
    )

}
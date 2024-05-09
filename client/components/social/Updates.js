import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/social/updates.module.scss";
import UserContext from "../../contexts/UserContext";
import { io } from 'socket.io-client';
import { FaTrashAlt } from "react-icons/fa";
import SocketPath from "../../utilities/socketPath";
import ReactMarkdown from 'react-markdown';

function Updates({admins}) {

    const socketRef = useRef(null);

    let {userInfo} = useContext(UserContext);
    let [updateList, setUpdateList] = useState([]);
    let [newUpdate, setNewUpdate] = useState("");

    const submitNewUpdate = async () => {

        if(!newUpdate || newUpdate.length > 5000) {
            return;
        }

        const response = await fetch('/api/addUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post: newUpdate }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        } else {
            setNewUpdate("");
        }

    }

    const deleteUpdate = async (id) => {

        const response = await fetch('/api/deleteUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updateId: id }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }

    }

    const fetchUpdates = async () => {

        try {
            const response = await fetch(`/api/getUpdates`);
            const data = await response.json();
            if(data.success) {
                setUpdateList(data.updates);
            }
        } catch(err) {
            console.log(err);
        }

    }
    
    const reconnectSocket = () => {

        if(socketRef.current) return;

        const socketUrl = SocketPath.URL;
        const socketPath = SocketPath.Path;
        let newSocket = io(socketUrl, {
            path: socketPath,
        });

        socketRef.current = newSocket;

        newSocket.on('newUpdate', (data) => {
            setUpdateList(oldUpdates => {
                let newUpdates = [data.update, ...oldUpdates];
                return newUpdates;
            });
        });

        newSocket.on('updateDeleted', (data) => {
            setUpdateList(oldUpdates => {
                let id;
                let newUpdates = JSON.parse(JSON.stringify(oldUpdates));
                for(let i = 0; i < newUpdates.length; i++) {
                    if(newUpdates[i].id === data.updateId) {
                        id = i;
                    }
                }
                newUpdates.splice(id, 1);
                return newUpdates;
            });
        });

    }

    useEffect(() => {

        reconnectSocket();
        fetchUpdates();

        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        }

    }, []);

    const isAdmin = admins.indexOf(userInfo?.username) !== -1;

    return(
        <div className={styles.updatesOuter}>
            <div className={styles.updatesHeader}>updates</div>
            
            {
                isAdmin ? 
                <div className={styles.newUpdate}>
                    <textarea
                        maxLength={5000}
                        placeholder="Enter update..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}></textarea>
                    <div
                        onClick={() => submitNewUpdate()} 
                        className={styles.submitPost}>
                        Submit
                    </div>
                </div> : null
            }

            {
                updateList.length === 0 ?
                <div className={styles.noUpdates}>
                    no updates
                </div> : null
            }

            {
                updateList.map((update) => 
                    <div
                        key={update.id} 
                        className={styles.updateItem}>

                        {
                            isAdmin ?
                            <div
                                onClick={() => deleteUpdate(update.id)} 
                                className={styles.deleteUpdate}>
                                <FaTrashAlt /> 
                            </div> : null
                        }

                        <div className={styles.updateDate}>
                            {new Date(update.date).toLocaleDateString()}
                        </div>
                        <div className={styles.updateInfo}>
                            <ReactMarkdown>
                                {update.info}
                            </ReactMarkdown>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default Updates;
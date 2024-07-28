import { useRouter } from 'next/router';
import styles from '../../styles/roomlayout.module.scss';
import { useEffect, useState, useContext, useRef } from 'react';
import Router from 'next/router';
import Head from 'next/head'
import StatsPanel from '../../components/room/StatsPanel';

import RoomContext from '../../contexts/RoomContext';
import Todo from '../../components/room/Todo';
import Journal from '../../components/room/Journal';
import UserSession from '../../components/UserSession';

import { io } from 'socket.io-client';
import UserContext from '../../contexts/UserContext';
import updateWorkHours from '../../reducers/updateWorkHours';
import CustomThemePicker from '../../components/room/CustomThemePicker';
import Banner from '../../components/room/Banner';
import getToday from '../../utilities/getToday';
import Link from 'next/link';
import SocketPath from '../../utilities/socketPath';

export default function Room () {

    const router = useRouter();
    const { id } = router.query;

    const socketRef = useRef(null);

    let { userInfo } = useContext(UserContext);

    const [roomData, setRoomData] = useState({});
    const [loading, setLoading] = useState(true);

    const reconnectSocket = () => {

        if(!id) return;

        if(socketRef.current) return;

        const socketUrl = SocketPath.URL;
        const socketPath = SocketPath.Path;
        const query = {room: `room_${id}`};
        // const socketUrl = 'https://ovel.sh';
        // const socketPath = '/socket';
        let newSocket = io(socketUrl, {
            path: socketPath,
            query
        });

        socketRef.current = newSocket;

        newSocket.on('newHourInfo', (data) => {
            setRoomData(prevRoomData => {
                const updatedRoomData = updateWorkHours(prevRoomData, {...data});
                return updatedRoomData;
            });
        });

        newSocket.on('newJoinRequest', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                oldData.joinRequests.push(data.username);
                return oldData;
            })
        });

        newSocket.on('roomRequestResponse', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                if(data.accept) {
                    oldData.users[data.userInfo.id] = {
                        currentStreak: null,
                        deepWorkTracker: [],
                        goals: {},
                        journal: {},
                        streakHighscore: null,
                        userInfo:data.userInfo
                    }
                }
                oldData.joinRequests.splice(oldData.joinRequests.indexOf(data.username), 1)
                return oldData;
            })
        });

        newSocket.on('streakUpdate', (data) => {

            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {
                    user,
                    startDate,
                    endDate,
                    highScoreStartDate,
                    highScoreEndDate
                } = data;
                if(!oldData.users[user].currentStreak) {
                    oldData.users[user].currentStreak = {}
                }
                if(!oldData.users[user].streakHighScore) {
                    oldData.users[user].streakHighScore = {}
                }
                oldData.users[user].currentStreak.startDate = startDate;
                oldData.users[user].currentStreak.endDate = endDate;
                oldData.users[user].streakHighScore.startDate = highScoreStartDate;
                oldData.users[user].streakHighScore.endDate = highScoreEndDate;
                return oldData;
            });

        });

        newSocket.on('newGoal', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const { goal } = data;
                oldData.users[goal.userId].goals[goal.id] = {
                    ...goal,
                    tasks: []
                };
                return oldData;
            });

        });

        newSocket.on('deleteGoal', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {user, goal} = data;
                delete oldData.users[user].goals[goal];
                return oldData;
            })
        });

        newSocket.on('newTask', (data) => { 
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {user, goal, newTask, tags} = data;
                let taskItem = {...newTask};
                taskItem.tags = tags;
                oldData.users[user].goals[goal].tasks.push(taskItem);
                oldData.users[user].goals[goal].endDate = null;
                return oldData;
            })

        });

        newSocket.on('deleteTask', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {user, goal, task, goalCompletedDate} = data;
                const taskIndex = oldData.users[user].goals[goal].tasks.findIndex(taskItem => taskItem.id === task);
                if (taskIndex > -1) {
                    oldData.users[user].goals[goal].tasks.splice(taskIndex, 1);
                }
                oldData.users[user].goals[goal].endDate = goalCompletedDate;
                return oldData;
            })
        });

        newSocket.on('toggleTask', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {user, goal, task, taskCompleted, goalCompleted} = data;
                const taskItem = oldData.users[user].goals[goal].tasks.find(taskItem => taskItem.id === task);
                if (taskItem) {
                    taskItem.dateCompleted = taskCompleted;
                }
                oldData.users[user].goals[goal].endDate = goalCompleted;
                return oldData;
            })
        });

        newSocket.on('journalEntryUpdate', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                const {user, entry, journalId, date, tags} = data;
                if(entry === "") {
                    delete oldData.users[user].journal[journalId];
                } else {
                    oldData.users[user].journal[journalId] = {
                        date,
                        entry,
                        tags
                    };
                }
                return oldData;
            })
        });

        newSocket.on('visibilityUpdate', (data) => {
            setRoomData(prevRoomData => {
                const oldData = JSON.parse(JSON.stringify(prevRoomData));
                oldData.public = data.public;
                return oldData;
            })
        });

    }

    const fetchData = async () => {

        if(!id) return;

        setLoading(true);

        const d = getToday();

        try {
            const response = await fetch(`/api/roomData?id=${id}&date=${d}`);
            const data = await response.json();
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

    useEffect(() => {
        
        fetchData();
        reconnectSocket();

    }, [id]);

    useEffect(() => {

        return () => {
            if(socketRef.current) {
                socketRef.current.disconnect();
            }
        }

    }, []);
    
    if(loading) return <div className={styles.loading}><div>Loading...</div></div>
    if(!roomData) return <div>Room not found</div>

    return (
        <RoomContext.Provider value={{roomData, setRoomData}}>
            <CustomThemePicker />
            <Banner />
            <div className={styles.roomOuter}>
                <Head>
                    <title>{roomData ? `shovel - productivity tool with journal & todo list - ${roomData.name}` : ''}</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <UserSession />
                <StatsPanel/>
                <div className={styles.mainContentOuter}>
                    <div className={styles.mainContent}>
                        <Todo />
                        <Journal />
                    </div>
                </div>
            </div>
            <div className={styles.mobileNotice}>
                Shovel is currently only supported on desktop and laptop devices.
                <Link href="/">Go Back</Link>
            </div>
        </RoomContext.Provider>
    )
}
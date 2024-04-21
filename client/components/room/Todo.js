import UserTabs from './UserTabs';
import RoomContext from '../../pages/RoomContext';
import UserContext from "../../pages/UserContext";
import styles from '../../styles/room/todo.module.scss';
import { HiPencilAlt } from "react-icons/hi";
import { useContext, useState, useEffect } from 'react';
import { FaArrowDownLong } from "react-icons/fa6";
import Goal from './Goal';

function Todo() {

    const {roomData} = useContext(RoomContext);
    const { userInfo } = useContext(UserContext);

    let [activeTab, setActiveTab] = useState(null);

    const getGoals = () => {

        if(!roomData) return {};
        if(!userInfo) return {};

        return roomData.users[userInfo.id].goals;

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
                Add a new goal <FaArrowDownLong />
            </div>
        )
    }

    useEffect(() => {

        if(!userInfo) return; 
        
        if(!activeTab) {
            setActiveTab(userInfo.id);
        }
    
    }, [userInfo]);

    if(!roomData) return null;
    if(!userInfo) return null;

    return (
        <div className={styles.todoOuter}>
                        
            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setActiveTab(parseInt(userId))}/>

            <div className={styles.todoInner}>

                { noGoals() }
                {
                    Object.keys(getGoals()).map((goalId) => <Goal goalItem={generateGoal(goalId)}/>)
                }

                <div className={styles.newGoal}>
                    <input type="text" placeholder="New Goal"></input>
                    <div className={styles.addGoal}>
                        <HiPencilAlt />
                    </div>
                </div>

            </div>

        </div>
    )
}
export default Todo;
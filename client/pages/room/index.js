import styles from '../../styles/room.module.scss';
import { useContext } from 'react';
import UserContext from "../UserContext";
import LoginPage from "../../components/LoginPage";
import EnterRoom from '../../components/EnterRoom';
import UserData from '../../components/UserSession';

export default function Room() {

    const {userInfo, setUserInfo} = useContext(UserContext);

    return (
        <div className={styles.roomTop}>
            <div className={styles.roomOuter}>
                <UserData />
                {
                    userInfo ?
                    <EnterRoom userInfo={userInfo} setUserInfo={setUserInfo}/>
                    :
                    <LoginPage />
                }
            </div>
        </div>
    )
}
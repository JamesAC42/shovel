import styles from '../../styles/room.module.scss';
import { useContext } from 'react';
import Head from 'next/head'
import UserContext from "../../contexts/UserContext";
import LoginPage from "../../components/LoginPage";
import EnterRoom from '../../components/EnterRoom';
import UserData from '../../components/UserSession';
import { IoMdBackspace } from "react-icons/io";
import Link from 'next/link';
import NavBar from '../../components/NavBar';
import CustomThemePicker from '../../components/room/CustomThemePicker';

export default function Room() {

    const {userInfo, setUserInfo} = useContext(UserContext);

    return (
        <div className={styles.roomTop}>
            <CustomThemePicker/>
            <Head>
                <title>shovel - productivity tool with journal & todo list</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <NavBar/>
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
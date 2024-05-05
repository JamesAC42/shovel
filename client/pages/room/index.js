import styles from '../../styles/room.module.scss';
import { useContext } from 'react';
import Head from 'next/head'
import UserContext from "../../contexts/UserContext";
import LoginPage from "../../components/LoginPage";
import EnterRoom from '../../components/EnterRoom';
import UserData from '../../components/UserSession';
import { IoMdBackspace } from "react-icons/io";
import Link from 'next/link';

export default function Room() {

    const {userInfo, setUserInfo} = useContext(UserContext);

    return (
        <div className={styles.roomTop}>
            <Head>
                <title>shovel</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className={styles.roomOuter}>
                <div className={styles.backHome}>
                    <Link
                        target="_self" 
                        href="/">
                        <IoMdBackspace />
                    </Link>
                </div>
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
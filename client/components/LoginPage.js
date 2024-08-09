import styles from "../styles/room.module.scss";
import Link from 'next/link';
import { PiBackspace } from "react-icons/pi";
import Login from "./Login";
import CreateUser from "./CreateUser";
import Guest from "./Guest";
import { useState } from "react";

export default function LoginPage() {

    const [mode, setMode] = useState(1);

    return (
        <div className={styles.loggedOut}>

            {
                mode === 1 ?
                <Login switchMode={() => setMode(2)}/>
                :
                <CreateUser switchMode={() => setMode(1)}/>
            }
            <Guest />
        </div>
    )
}
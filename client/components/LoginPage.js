import styles from "../styles/room.module.scss";
import Link from 'next/link';
import { PiBackspace } from "react-icons/pi";
import Login from "./Login";
import CreateUser from "./CreateUser";
import Guest from "./Guest";

export default function LoginPage() {
    return (
        <div className={styles.loggedOut}>
            <Login />
            <CreateUser />
            <Guest />
        </div>
    )
}
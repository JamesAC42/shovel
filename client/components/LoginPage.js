import styles from "../styles/room.module.scss";
import Link from 'next/link';
import { PiBackspace } from "react-icons/pi";
import Login from "./login";
import CreateUser from "./createUser";

export default function LoginPage() {
    return (
        <div className={styles.loggedOut}>
            <Login />
            <CreateUser />
        </div>
    )
}
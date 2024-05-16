import styles from "../styles/room.module.scss";
import { FaInfoCircle } from "react-icons/fa";
import Link from 'next/link';
import { useEffect, useState } from "react";

function Guest() {

    let [hasGuestRoom, setHasGuestRoom] = useState(false);
    useEffect(() => {
        if(hasGuestRoom) return;
        let guestData = localStorage.getItem("guest-room");
        if(guestData) {
            setHasGuestRoom(true);
        }
    }, []);

    return(
        <div className={styles.guest}>
            <h2>Use as Guest</h2>
            <p>
                <span><FaInfoCircle/></span>Guest mode doesn't require an account. You will be able to use shovel, 
                but the data for your room will be stored locally on your browser instead
                of saved on the server. Guest rooms are limited to just you. Login or 
                create an account to make online rooms that up to 4 other people can 
                join and can be accessed anywhere.
            </p>
            {
                hasGuestRoom ?
                <p className={styles.existingGuestRoom}>
                    You have an existing guest room. Click continue to enter: 
                </p> : null
            }
            <Link href="/guest">Continue</Link>
        </div>
    )

}

export default Guest;
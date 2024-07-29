import RoomContext from '../../contexts/RoomContext';
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../../styles/explore.module.scss";
import CustomThemePicker from '../../components/room/CustomThemePicker';
import NavBar from '../../components/NavBar';
import Link from 'next/link';

const Explore = () => {


    const [publicRooms, setPublicRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if(publicRooms.length === 0) {
            setLoading(true);
            fetch('/api/publicRooms')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setPublicRooms(data.rooms);
                    } else {
                        console.error('Failed to fetch public rooms:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error fetching public rooms:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

    }, [publicRooms]);

    return(
        <div className={styles.exploreTop}>
        <div className={styles.exploreInner}>
            <CustomThemePicker />
            <div className={styles.roomOuter}>
                <Head>
                    <title>shovel - productivity tool with journal & todo list - guest</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <NavBar />
                <div className={styles.mainContent}>
                    <div className={styles.exploreAbout}>
                        <h1>Explore Rooms</h1>
                        <p>
                        Discover how others boost their productivity and find inspiration for your own deep work journey.
                        </p>
                        <h2>What are Public Rooms?</h2>
                        <p>
                        Public rooms are collaborative spaces where Shovel users share their goals, tasks, and progress. Join a room to:
                        </p>
                        <ul>
                            <li>Get inspired by others' productivity strategies</li>
                            <li>Share your own achievements and challenges</li>
                            <li>Find accountability partners</li>
                            <li>Learn new techniques for managing tasks and time</li>
                        </ul>
                        <h2>FAQ</h2>
                        <div className={styles.faqSection}>
                            <p>Q: How do I join a room?</p>
                            <p>A: Make your own room public by clicking the eye icon while in the room, or join an existing room by entering the ID under "Join an existing room".</p>
                        </div>
                        <div className={styles.faqSection}>
                            <p>Q: How many public rooms can I join?</p>
                            <p>A: You can be in up to 5 public rooms at a time.</p>
                        </div>
                        <div className={styles.faqSection}>
                            <p>Q: Can I make my room private later?</p>
                            <p>A: Yes, you can change your room settings at any time.</p>
                        </div>
                    </div>
                    <div className={styles.exploreList}>
                        <div className={styles.listHeader}>
                            <h2>
                                Browse Public Rooms
                            </h2>
                        </div>
                        {
                            loading ?
                            <div className={styles.loading}>
                                Loading rooms...
                            </div> : null
                        }
                        <div className={styles.listContent}>
                            <ul>
                                {
                                    publicRooms.map((r) =>
                                        <li key={r.name}>
                                            <Link href={"/room/" + r.id}>
                                            {r.name} - {r.users.length} user{r.users.length > 1 ? "s" : ""}
                                            </Link>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )

}

export default Explore;
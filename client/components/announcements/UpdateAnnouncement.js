import Image from "next/image";
import styles from "../../styles/updateannouncement.module.scss";
import { FaMugSaucer } from "react-icons/fa6";

function UpdateAnnouncement({onClose}) {

    return(
        <>
            <div className={styles.updateAnnouncement}>
                <h1>New features!</h1>
                <p>Thank you for using Shovel! As of 9/12/2024 the following features are now available:</p>
                <ul>
                    <li>Change room name</li>
                    <li>Leave and delete rooms</li>
                    <li>Fixed some minor layout issues</li>
                    <li>Tutorial slideshow for getting started</li>
                    <li>Fixed an issue where older account could not log in</li>
                    <li>Added timer view with stopwatch, alarm, and pomodoro modes</li>
                </ul>
                <div className={styles.imageSection}>
                    <Image 
                        className={styles.imageImage} 
                        src="/images/updates/timer.png" 
                        height={171}
                        width={886}
                        objectFit="cover" 
                        alt="timer"/>
                    <div className={styles.imageCaption}>Set a timer, stopwatch, or pomodoro session!</div>
                </div>
                <div className={styles.divider}></div>
                <p>Help support the site for more features! Coming soon: Notebooks and AI Tutoring!</p>
                <div className={styles.kofiButtonOuter}>
                    <a href="https://ko-fi.com/shovelproductivity" target="_blank" className={styles.kofiButton}>
                        <FaMugSaucer />
                        Support Shovel on Ko-Fi
                    </a>
                </div>
            </div>
        </>
    )

}
export default UpdateAnnouncement;
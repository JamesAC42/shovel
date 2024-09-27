import Image from "next/image";
import styles from "../../styles/updateannouncement.module.scss";
import { FaMugSaucer } from "react-icons/fa6";
import Link from "next/link";

function UpdateAnnouncement({onClose}) {

    return(
        <>
            <div className={styles.updateAnnouncement}>
                <h1>New features!</h1>
                <p>Thank you for using Shovel! As of 9/27/2024 the following features are now available:</p>
                <ul>
                    <li>Collapse the journal and todo panels</li>
                    <li>Archive old goals (premium only)</li>
                    <li><Link href="/premium">Premium memberships</Link> (new features coming soon!)</li>
                    <li>Room timer for tracking your work, including pomodoro mode</li>
                    <li>Leave, delete, and rename rooms</li>
                </ul>
                <div className={styles.divider}></div>
                <p>Help support the site for more features! Coming soon: Notebooks and AI Tutoring!</p>
                <p>You can support Shovel in two ways:</p>
                <div className={styles.supportOptions}>
                    <div className={styles.supportOption}>
                        <h3>One-time Donation</h3>
                        <p>Support Shovel with a one-time donation!</p>
                        <div className={styles.kofiButtonOuter}>
                            <a href="https://ko-fi.com/shovelproductivity" target="_blank" className={styles.kofiButton}>
                                <FaMugSaucer />
                                Support Shovel on Ko-Fi
                            </a>
                        </div>
                    </div>
                    <div className={styles.supportOption}>
                        <h3>Premium Monthly Subscription</h3>
                        <p>Get access to exclusive features!</p>
                        <Link href="/premium" className={styles.premiumButton}>
                            Go Premium
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )

}
export default UpdateAnnouncement;
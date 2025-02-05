import Image from "next/image";
import styles from "../../styles/updateannouncement.module.scss";
import { FaMugSaucer } from "react-icons/fa6";
import Link from "next/link";

function UpdateAnnouncement({onClose}) {
    return(
        <>
            <div className={styles.updateAnnouncement}>
                <h1>New Feature: AI Quiz Generator!</h1>
                <p>We're excited to announce our new AI-powered quiz feature on Shovel Notes!</p>
                
                <div className={styles.videoSection}>
                    <video 
                        className={styles.demoVideo} 
                        controls 
                        autoPlay 
                        muted 
                        loop
                    >
                        <source src="/video/quizdemo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className={styles.videoCaption}>
                        Watch how easy it is to generate and take quizzes!
                    </div>
                </div>

                <ul>
                    <li>Generate quizzes from your notes automatically</li>
                    <li>Test your understanding of any topic</li>
                    <li>Multiple choice and short answer questions</li>
                    <li>Track your progress over time</li>
                </ul>

                <div className={styles.tryItNow}>
                    <a href="https://notes.ovel.sh" className={styles.tryButton}>
                        Try It Now on Shovel Notes
                    </a>
                </div>

                <div className={styles.divider}></div>

                <p>Help support the site for more features like this!</p>
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
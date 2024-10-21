import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/premium.module.scss';
import CustomThemePicker from '../../components/room/CustomThemePicker';
import NavBar from '../../components/NavBar';
import UserSession from '../../components/UserSession';
import { useContext } from 'react';
import { FaCheckCircle } from "react-icons/fa";
import { GiDiamonds } from "react-icons/gi";
import postFetch from '../../lib/postFetch';
import UserContext from '../../contexts/UserContext';

function PremiumPage() {
    const router = useRouter();
    const { userInfo } = useContext(UserContext);

    const handleSubscribe = async () => {
        if (!userInfo) {
            router.push('/room');
            return;
        }
        if (userInfo?.tier === 2) {
            return;
        }
        let response = await postFetch("/api/createCheckoutSession", {});
        if (response.success) {
            window.location.href = response.url; 
        }
    }

    return (
        <div className={styles.premiumPage}>
            <CustomThemePicker/>
            <Head>
                <title>shovel - Upgrade to Premium</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <NavBar/>
            <UserSession />
            <h1>Upgrade to Premium</h1>
            <p className={styles.subtitle}>Exclusive features including notebook, flashcard maker, and early access to upcoming AI-powered tools.</p>
            <div className={styles.featuresContainer}>
                <div className={styles.featureBox}>
                    
                    <div className={styles.boxIcon}>
                        <FaCheckCircle/>
                    </div>

                    <h2>Free</h2>
                    <div className={styles.price}>$0</div>
                    <div className={styles.buyContainer}>
                        Account Required
                    </div>
                    <ul>
                        <li>Goals and Task Manager</li>
                        <li>Daily Journal</li>
                        <li>Multi-user rooms</li>
                        <li>Work timers: Alarm, Stopwatch, and Pomodoro</li>
                        <li>Deep work hour tracker</li>
                        <li>Streak tracker</li>
                        <li>Notebook</li>
                        <li>Flashcards</li>
                    </ul>
                </div>
                <div className={`${styles.featureBox} ${styles.premium}`}>
                    <div className={styles.boxIcon}>
                        <GiDiamonds/>
                    </div>
                    <h2>Premium</h2>
                    <div className={styles.price}>$10<span>/month</span></div>
                    <div
                        onClick={handleSubscribe}
                        className={styles.buyContainer}>
                        { userInfo?.tier === 2 ? "Subscribed" : "Try for Free - 7 Days" }
                    </div>
                    <ul>
                        <li>Goal Archive</li>
                        <li>Unlimited notebook pages</li>
                        <li>Generate flashcards from notes</li>
                        <li><strong>Coming soon:</strong> AI summaries</li>
                        <li><strong>Coming soon:</strong> AI tutor</li>
                        <li><strong>Coming soon:</strong> AI quizzes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PremiumPage;
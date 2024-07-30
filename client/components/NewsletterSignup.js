import styles from "../styles/newsletter.module.scss";
import { useState } from 'react';

const NewsletterSignup = ({ onClose }) => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/newsletterSignup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.success) {
                onClose();
            } else {
                setError("An error occurred while signing up.");
            }
        } catch (error) {
            console.error('Error during newsletter signup:', error);
            // You might want to add some error feedback for the user
        }
    };

    return (
        <div className={styles.newsletterOuter}>
                <h2 className={styles.newsletterTitle}>Stay in the Loop and Unlock Future Perks!</h2>
                <p className={styles.newsletterIntro}>📧 Connect your email to your Shovel account and enjoy:</p>

                <ul className={styles.benefitsList}>
                    <li>Exclusive updates on new productivity features</li>
                    <li>Tips and tricks to maximize your Shovel experience</li>
                    <li>Early access to upcoming premium features</li>
                    <li>Important account notifications</li>
                </ul>

                <p className={styles.privacyNote}>We respect your inbox and will only send you the good stuff. You can unsubscribe anytime.</p>

                <p className={styles.termsNote}>By adding your email, you agree to receive occasional updates from Shovel. We'll never share your information with third parties.</p>
                <div className={styles.input}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className={styles.emailInput}
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <button 
                        className={styles.submitButton}
                        onClick={handleSubmit}>
                        Connect & Boost My Productivity
                    </button>
                    {
                        error ?
                        <div className={styles.error}>
                            {error}
                        </div> : null
                    }
                </div>

                <p className={styles.declineOption}>
                    <a href="#" className={styles.declineLink}>No thanks, I'll stick to the basics for now</a>
                </p>
        </div>
    )

}

export default NewsletterSignup;
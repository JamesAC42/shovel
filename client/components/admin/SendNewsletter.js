import postFetch from "../../lib/postFetch";
import styles from "../../styles/admin/sendnewsletter.module.scss";
import { useState, useEffect } from 'react';

const SendNewsletter = () => {

    const [newsletters, setNewsletters] = useState([]);
    const [popupMessage, setPopupMessage] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                const response = await postFetch('/api/getNewsletters');
                if(response.success) {
                    setNewsletters(response.newsletters);
                }
            } catch (error) {
                console.error('Error fetching newsletters:', error);
            }
        };

        fetchNewsletters();
    }, []);

    const handleSendNewsletter = async (folderName) => {
        if(loading) return;
        setLoading(true);
        try {
            const response = await postFetch('/api/sendNewsletter', { folderName });
            if (response.success) {
                setPopupMessage(`${folderName}: ${response.message}`);
            } else {
                setPopupMessage(`Failed to send newsletter ${folderName}`);
            }
        } catch (error) {
            console.error('Error sending newsletter:', error);
            setPopupMessage(`Error sending newsletter ${folderName}`);
        }
        setLoading(false);
        setTimeout(() => setPopupMessage(null), 3000); // Hide popup after 3 seconds
    };

    return (
        <div className={styles.sendNewsletterOuter}>
            {popupMessage?.length > 0 && (
                <div className={styles.popup}>
                    {popupMessage}
                </div>
            )}
            {
                newsletters.map(n => (
                    <div key={n} className={styles.newsletterItem}>
                        {n}
                        <div 
                            className={`${styles.newsletterSend} ${
                                loading ? styles.loading : ''
                            }`}
                            onClick={() => handleSendNewsletter(n)}
                        >
                            {loading ? "Sending..." : "Send"}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default SendNewsletter;
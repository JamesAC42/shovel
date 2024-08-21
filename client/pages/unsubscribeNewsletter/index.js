import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import postFetch from '../../lib/postFetch';
import styles from "../../styles/unsubscribe.module.scss";

const UnsubscribeNewsletter = () => {
    const [message, setMessage] = useState('Unsubscribing...');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = async () => {
            try {
                const response = await postFetch('/api/unsubscribeNewsletter');
                if (response.success) {
                    setMessage('Successfully unsubscribed. Redirecting...');
                } else {
                    setMessage('Failed to unsubscribe. Redirecting...');
                }
            } catch (error) {
                console.error('Error unsubscribing:', error);
                setMessage('An error occurred. Redirecting...');
            }
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                router.push('/');
            }, 2000);
        };

        unsubscribe();
    }, [router]);

    return (
        <div className={styles.unsubscribeOuter}>
            <h1>{message}</h1>
        </div>
    );
};

export default UnsubscribeNewsletter;

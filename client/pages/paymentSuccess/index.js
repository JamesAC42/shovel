import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/paymentresult.module.scss';
import CustomThemePicker from '../../components/room/CustomThemePicker';
import NavBar from '../../components/NavBar';
import UserSession from '../../components/UserSession';

function PaymentSuccessPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/room');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.paymentResultPage}>
            <CustomThemePicker />
            <Head>
                <title>shovel - Payment Successful</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <NavBar />
            <UserSession />
            <h1>Payment Successful!</h1>
            <p>Thank you for upgrading to Premium. You will be redirected in 5 seconds.</p>
        </div>
    );
}

export default PaymentSuccessPage;

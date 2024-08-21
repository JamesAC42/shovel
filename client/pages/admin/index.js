
import Head from "next/head";
import styles from "../../styles/admin.module.scss";
import CustomThemePicker from '../../components/room/CustomThemePicker';
import NavBar from '../../components/NavBar';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import UserContext from '../../contexts/UserContext';
import SendNewsletter from "../../components/admin/SendNewsletter";

export const adminViews = {
    sendNewsletter: "1",
    1: "sendNewsletter",
}

const Admin = () => {
    
    const router = useRouter();
    const [view, setView] = useState(adminViews.sendNewsletter);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    
    let { userInfo } = useContext(UserContext);

    useEffect(() => {
        getAdmins();
    }, []);

    useEffect(() => {
        if (!loading && userInfo && (!admins.includes(userInfo.username))) {
            console.log(loading, userInfo, admins);
            router.push('/');
        }
    }, [userInfo, admins, loading]);

    const getAdmins = async () => {
        try {
            const response = await fetch(`/api/getAdminUsernames`);
            const data = await response.json();
            if (data.success) { 
                setAdmins(data.adminUsernames);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const renderView = () => {

        switch(view) {
            case adminViews.sendNewsletter:
                return <SendNewsletter />
        }
        return null;

    }

    const viewItemClass = (v) => {
        let className = styles.viewItem;
        if(view === v) {
            className += " " + styles.viewItemActive;
        }
        return className;
    }

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
                    <div className={styles.selectView}>
                        <div
                            onClick={() => setView(adminViews.sendNewsletter)} 
                            className={viewItemClass(adminViews.sendNewsletter)}>
                            send newsletter
                        </div>
                    </div>
                    <div className={styles.viewOuter}>
                    {
                        renderView()
                    }
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default Admin;
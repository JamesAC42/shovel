import { useState, useEffect } from "react";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import styles from "../../styles/social.module.scss";
import Updates from "../../components/social/Updates";
import Feedback from "../../components/social/Feedback";
import UserSession from "../../components/UserSession";

export const socialViews = {
    feedback:"1",
    updates:"2",
    1:"feedback",
    2:"updates"
}

export default function Social() {

    const [view, setView] = useState(socialViews.feedback);
    const [admins, setAdmins] = useState([]);

    const getAdmins = async () => {
        try {
            const response = await fetch(`/api/getAdminUsernames`);
            const data = await response.json();
            if(data.success) { 
                setAdmins(data.adminUsernames);
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAdmins();
    }, []);

    const renderActiveView = () => {
        switch(view) {
            case socialViews.feedback:
                return <Feedback admins={admins}/>
            case socialViews.updates:
                return <Updates admins={admins}/>;
            default:
                return null;
        }
    }

    return (
        <div className={styles.socialTop}>
            <Head>
                <title>shovel - {socialViews[view]}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <NavBar/>
            <UserSession />
            <div className={styles.socialOuter}>
                <div className={styles.socialNav}>
                    <div className={styles.navItemContainer}>
                        {
                            Object.keys(socialViews).filter((v) => !isNaN(v)).map((v) =>
                                <div 
                                    key={v}
                                    className={`${styles.navItem} ${
                                        v === view ? styles.navItemActive : ""
                                    }`}
                                    onClick={() => setView(v)}>
                                    {socialViews[v]} 
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={styles.socialContent}>
                    {renderActiveView()}
                </div>
            </div>
        </div>
    )
}
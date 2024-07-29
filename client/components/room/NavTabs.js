import styles from "../../styles/roomtabs.module.scss";

import { HiClipboardList } from "react-icons/hi";
import { BiSolidBook } from "react-icons/bi";
import { FaClock } from "react-icons/fa";

export const views = {
    todo:1,
    journal:2,
    grid:3
}

const NavTabs = ({
    setActiveView
}) => {
    
    return (
        <div className={styles.tabs}>
            <div className={styles.tabsInner}>
                <div    
                    onClick={() => setActiveView(views.grid)} 
                    className={styles.tab}>
                    <FaClock/>
                </div>
                <div    
                    onClick={() => setActiveView(views.todo)} 
                    className={`${styles.tab} ${styles.tabTodo}`}>
                    <HiClipboardList/>
                </div>
                <div 
                    onClick={() => setActiveView(views.journal)} 
                    className={`${styles.tab} ${styles.tabJournal}`}>
                    <BiSolidBook/>
                </div>
            </div>
        </div>
    )
}

export default NavTabs;
import styles from '../../styles/room/statspanel.module.scss';
import { TbCircleFilled } from "react-icons/tb";
import { FaUndo } from "react-icons/fa";

export default function DeepWorkButtons() {
    return (
        <div className={styles.workButtons}>
            <div className={styles.addButtons}>
                <div className={styles.workButton}>
                    <span className={styles.workMarker}><TbCircleFilled/></span>
                </div>
                <div className={styles.workButton}>
                    <span className={styles.workMarkerSpecial}><TbCircleFilled/></span>
                </div>
            </div>
            <div className={styles.undoButton}>
                <div className={styles.workButton}>
                    <span className={styles.undoButton}><FaUndo /></span>
                </div>
            </div>
        </div>
    )
}
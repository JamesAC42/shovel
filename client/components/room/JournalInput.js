import { FaUndo, FaSave, FaEraser } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import styles from "../../styles/room/journal.module.scss";

function JournalInput() {
    return(
        <div className={styles.journalInputContainer}>

            <div className={styles.journalInputTextOuter}>
                <textarea 
                    className={styles.journalInputMain} 
                    placeholder="What's new today..."></textarea>
                <textarea 
                    className={styles.journalInputTags} 
                    placeholder="tag 1, tag 2, ..."></textarea>
            </div>
            <div className={styles.journalInputControls}>
                <div className={styles.journalInputControl}>
                    <FaSave />
                </div>
                <div className={styles.journalInputControl}>
                    <FaUndo />
                </div>
                <div className={styles.journalInputControl}>
                    <FaEraser />
                </div>
                <div className={styles.journalInputControl}>
                    <FaFileArrowUp />
                </div>

            </div>
        </div>
    )
}
export default JournalInput;
import { FaSave, FaEraser } from "react-icons/fa";
import { FaFileArrowUp } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import styles from "../../styles/room/journal.module.scss";
import { useContext, useState } from "react";
import RoomContext from "../../pages/RoomContext";
import UserContext from "../../pages/UserContext";
import getToday from "../../utilities/getToday";

function JournalInput({entries,currentYear,currentMonth,collapsed}) {

    let { roomData } = useContext(RoomContext);
    let { userInfo } = useContext(UserContext);

    let [entryValue, setEntryValue] = useState("");
    let [tagValue, setTagValue] = useState("");

    const saveEntryHandle = async (entry, tagString) => {

        let tags = tagString.split(',');
        tags = 
            tags
                .filter(tag => tag.trim() !== "" && tag.length <= 50)
                .map(tag => tag.trim());
        
        let filteredTags = [];
        for(let tag of tags) {
            if(filteredTags.indexOf(tag) === -1) {
                filteredTags.push(tag);
            }
        }

        const response = await fetch('/api/saveJournalEntry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                room: roomData.id,
                entry,
                date: getToday(),
                tags: filteredTags
            }),
        });
        const data = await response.json();
        if (!data.success) {
            console.error(data.message);
        }

    }

    const saveEntry = async () => {

        if(!roomData) return;
        if(!userInfo) return;
        if(entryValue.length === 0 || entryValue.length > 5000) return;
        saveEntryHandle(entryValue, tagValue);

    }

    const deleteEntry = () => {

        setTagValue("");
        setEntryValue("");
        saveEntryHandle("", "");

    }

    const eraseEntry = () => {
        
        setEntryValue("");
        setTagValue("");

    }

    const loadEntry = () => {

        if(!roomData) return;
        if(!userInfo) return;
        
        if(!currentYear || !currentMonth) return;

        let entry = entries[currentYear][currentMonth][0];
        setEntryValue(entry.entry);
        setTagValue(entry.tags.join(", "));

    }

    return(
        <div className={`${styles.journalInputContainer} ${collapsed ? styles.collapsed : ''}`}>

            <div className={styles.journalInputTextOuter}>
                <textarea 
                    onChange={(e) => setEntryValue(e.target.value)}
                    maxLength={5000}
                    value={entryValue}
                    className={styles.journalInputMain} 
                    placeholder="What's new today..."></textarea>
                <textarea 
                    onChange={(e) => setTagValue(e.target.value)}
                    maxLength={200}
                    value={tagValue}
                    className={styles.journalInputTags} 
                    placeholder="tag 1, tag 2, ..."></textarea>
            </div>
            <div className={styles.journalInputControls}>
                <div 
                    title="Save Entry"
                    onClick={() => saveEntry()}
                    className={styles.journalInputControl}>
                    <FaSave />
                </div>
                <div
                    title="Delete Today's Entry"
                    onClick={() => deleteEntry()} 
                    className={styles.journalInputControl}>
                    <FaTrashAlt />
                </div>
                <div
                    title="Clear Fields"
                    onClick={() => eraseEntry()} 
                    className={styles.journalInputControl}>
                    <FaEraser />
                </div>
                <div
                    title="Edit Today's Entry"
                    onClick={() => loadEntry()} 
                    className={styles.journalInputControl}>
                    <FaFileArrowUp />
                </div>

            </div>
        </div>
    )
}
export default JournalInput;
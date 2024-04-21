import UserTabs from './UserTabs';
import RoomContext from '../../pages/RoomContext';
import UserContext from "../../pages/UserContext";

import styles from '../../styles/room/journal.module.scss';
import JournalMonthPicker from './JournalMonthPicker';
import { useState, useContext, useEffect } from 'react';
import JournalInput from './JournalInput';

function Journal() {

    /* 
    {
        users: {
            []: {
                journal: {
                    [id]: {
                        date: entry.date,
                        entry: entry.entry,
                        tags: []
                    }
                }
            }
        }
    }
    
    userInfo: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        color: user.color,
        dateCreated: user.dateCreated
    }
    */

    const {roomData} = useContext(RoomContext);
    const { userInfo } = useContext(UserContext);

    const [entries, setEntries] = useState({});
    const [years, setYears] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(null);

    const [activeTab, setActiveTab] = useState(null);

    const setMonth = (month, year) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    }

    const showInput = () => {
        
        if(activeTab !== userInfo.id) return false;
        if(!currentYear || !currentMonth) {
            return true;
        }

        const currentDate = new Date();
        const actualCurrentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const actualCurrentYear = currentDate.getFullYear();

        return actualCurrentMonth === currentMonth && actualCurrentYear === currentYear;
    }

    const generateEntries = () => {
        const journal = roomData.users[userInfo.id].journal;
    
        let entries = {};
        let dates = {};
        for(let id in journal) {
            
            const entryDate = new Date(journal[id].date);
            const year = entryDate.getFullYear();
            const month = entryDate.toLocaleString('default', { month: 'long' });
    
            if (!dates[year]) {
                dates[year] = [];
            }
            if (!dates[year].includes(month)) {
                dates[year].push(month);
            }
    
            if(!entries[year]) { 
                entries[year] = {};
            }
            if(!entries[year][month]) {
                entries[year][month] = [];
            }
    
            entries[year][month].push({
                id: id,
                date: entryDate,
                entry: journal[id].entry,
                tags: journal[id].tags
            });
    
        }
    
        for(let year in entries) {
            for(let month in year) {
                entries[year][month].sort((a, b) => b.date - a.date);
            }
        }
    
        let years = [];
        for(let year in dates) {
            years.push({year, months: [...dates[year]]});
        }
        years.sort((a, b) => b.year - a.year);

        setEntries(entries);
        setYears(years);

    }
    
    const getSelectedEntries = () => (
        currentYear && currentMonth ? entries[currentYear]?.[currentMonth] : []
    )

    const noEntries = () => {
        let entries = getSelectedEntries();
        if(entries.length > 0) return null;

        return (
            <div className={styles.noEntries}>
                No entries for this date
            </div>
        )
    }

    useEffect(() => {
        
        if(!roomData) return;
        if(!userInfo) return;

        generateEntries();

        if(!activeTab) {
            setActiveTab(userInfo.id);
        }

        if(!currentYear || !currentMonth) {
            if(years.length > 0) {
                setCurrentYear(years[0].year);
                setCurrentMonth(years[0].months[0]);
            }
        }

    }, [roomData, userInfo]);

    if(!roomData) return null;
    if(!userInfo) return null;
    
    return (
        <div className={styles.journalOuter}>

            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setActiveTab(parseInt(userId))}/>
            
            <div className={styles.journalInner}>
            
                <JournalMonthPicker
                    years={years}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    setMonth={(month, year) => setMonth(month, year)} />
            
                <div className={styles.journalContent}>
                    <h2>Journal</h2>

                    {
                        showInput() ? 
                        <JournalInput /> : null
                    }

                    { noEntries() }

                    {
                        getSelectedEntries().map(entry =>        
                        <div className={styles.journalEntry}>
                            <h3>
                                {
                                    entry.date.toLocaleString('en-US', 
                                    { 
                                        month: 'long', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                    })
                                }
                                {
                                    entry.tags.map(tag =>
                                    <span className={styles.journalTag}>{tag}</span>
                                    )
                                }
                            </h3>
                            <p>
                                {entry.entry}
                            </p>
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default Journal;
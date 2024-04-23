import UserTabs from './UserTabs';
import RoomContext from '../../pages/RoomContext';
import UserContext from "../../pages/UserContext";

import styles from '../../styles/room/journal.module.scss';
import JournalMonthPicker from './JournalMonthPicker';
import { useState, useContext, useEffect } from 'react';
import JournalInput from './JournalInput';

import ReactMarkdown from 'react-markdown';
import dateToReadable from '../../utilities/dateToReadable';        

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

    let resetActiveMonth = false;

    const setMonth = (month, year) => {
        setCurrentMonth(month);
        setCurrentYear(year);
    }

    const getMonthString = (monthNumber) => {
        let mn = parseInt(monthNumber) - 1;
        return months[mn];
    }

    const getMonthNumber = (month) => {
        return months.indexOf(month);
    }

    const showInput = () => {
        
        if(activeTab !== userInfo.id) return false;
        if(!currentYear || !currentMonth) {
            return true;
        }

        const currentDate = new Date();
        const actualCurrentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const actualCurrentYear = currentDate.getFullYear();

        console.log("actual month", actualCurrentMonth, actualCurrentYear);
        console.log("set month", currentMonth, currentYear);

        return actualCurrentMonth === currentMonth && actualCurrentYear === parseInt(currentYear);
    }

    const generateEntries = () => {

        const journal = roomData.users[activeTab].journal;
        
        console.log("journal", journal);

        let entries = {};
        let dates = {};

        let monthFound = false;

        for(let id in journal) {
            
            const entryDate = journal[id].date;
            const dateSegments = entryDate.split('-');
            const year = dateSegments[0];
            const month = getMonthString(dateSegments[1]);

            if(month === currentMonth) monthFound = true;
    
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

        console.log("new entries", entries);

        if(!monthFound) {
            console.log("month not found");
            setCurrentMonth(null);
            setCurrentYear(null);
        }

        console.log("entries", entries);
        console.log("dates", dates);
    
        for(let year in entries) {
            console.log("year", year);
            for(let month in entries[year]) {
                console.log(year, month);
                entries[year][month].sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime());
            }
        }
    
        let years = [];
        for(let year in dates) {
            let yearItem = {year, months: [...dates[year]]};
            yearItem.months.sort((a, b) => getMonthNumber(b) - getMonthNumber(a));
            years.push(yearItem);
        }
        years.sort((a, b) => b.year - a.year);

        setEntries(entries);
        setYears(years);

    }
    
    const getSelectedEntries = () => {
        if(!currentYear || !currentMonth) {
            return [];
        } else {
            return entries[currentYear][currentMonth];
        }
    }

    const getSelectedTimeString = () => {
        let timeRange;
        if(!currentMonth || !currentYear) {
            let month = new Date().toLocaleString('default', { month: 'long' });
            let year = new Date().getFullYear();
            timeRange = `${month} ${year}`
        } else {
            timeRange =  `${currentMonth} ${currentYear}`;
        }
        return timeRange;
    }

    const noEntries = () => {
        let entries = getSelectedEntries();
        if(entries.length > 0) return null;

        let timeRange = getSelectedTimeString();
        return (
            <div className={styles.noEntries}>
                No entries for {timeRange}
            </div>
        )
    }

    const setTab = (tab) => { 
        resetActiveMonth = true;
        setActiveTab(tab);
    }

    useEffect(() => {
        
        if(!roomData) return;
        if(!userInfo) return;

        if(!activeTab) {
            setActiveTab(userInfo.id);
        } else {
            generateEntries();
        }

    }, [roomData, userInfo]);

    useEffect(() => {

        setCurrentMonth(null);
        setCurrentYear(null);
        if(activeTab) {
            generateEntries();
        }

    }, [activeTab])

    useEffect(() => {
        
        setCurrentYear(null);
        setCurrentMonth(null);
        if(years.length > 0) {
            setCurrentYear(years[0].year);
            setCurrentMonth(years[0].months[0]);
        }

    }, [years]);

    if(!roomData) return null;
    if(!userInfo) return null;

    console.log("current month", currentMonth);
    
    return (
        <div className={styles.journalOuter}>

            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setTab(parseInt(userId))}/>
            
            <div className={styles.journalInner}>
            
                <JournalMonthPicker
                    years={years}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    setMonth={(month, year) => setMonth(month, year)} />
            
                <div className={styles.journalContent}>
                    <h2>Journal - {getSelectedTimeString()}</h2>

                    {
                        showInput() ? 
                        <JournalInput
                            entries={entries} 
                            currentYear={currentYear}
                            currentMonth={currentMonth} /> : null
                    }

                    { noEntries() }

                    {
                        getSelectedEntries().map(entry =>        
                        <div
                            key={entry.date}
                            className={styles.journalEntry}>
                            <h2>
                                {
                                    dateToReadable(entry.date)
                                }
                                {
                                    entry.tags.map(tag =>
                                    <span
                                        key={tag}
                                        className={styles.journalTag}>{tag}</span>
                                    )
                                }
                            </h2>
                            <ReactMarkdown>
                                {entry.entry}
                            </ReactMarkdown>
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default Journal;
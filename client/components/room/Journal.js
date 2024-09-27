import UserTabs from './UserTabs';
import RoomContext from '../../contexts/RoomContext';
import UserContext from "../../contexts/UserContext";

import styles from '../../styles/room/journal.module.scss';
import JournalMonthPicker from './JournalMonthPicker';
import { useState, useContext, useEffect } from 'react';
import JournalInput from './JournalInput';
import { HiPencilAlt } from "react-icons/hi";
import { FaChevronUp } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

import ReactMarkdown from 'react-markdown';
import dateToReadable from '../../utilities/dateToReadable';        

import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Journal({activeView, todoCollapsed, journalCollapsed, onCollapsed, isGuest}) {

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

    const [journalInputCollapsed, setJournalInputCollapsed] = useState(false);

    const [savedActiveMonth, setSavedActiveMonth] = useState({});
    const [activeTab, setActiveTab] = useState(null);

    const [showDatePicker, toggleDatePicker] = useState(false);

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

    const getDefaultTime = () => {
        const currentDate = new Date();
        const defaultMonth = currentDate.toLocaleString('default', { month: 'long' });
        const defaultYear = currentDate.getFullYear().toString();
        return {defaultMonth, defaultYear};
    }

    const showInput = () => {
        
        if(!userInfo && !roomData.guest) return null;
        let userId = roomData.guest ? 1 : userInfo.id;
        if(activeTab !== userId) return false;
        if(!currentYear || !currentMonth) {
            return true;
        }

        const {defaultMonth, defaultYear} = getDefaultTime();
        return defaultMonth === currentMonth && defaultYear === currentYear;
    }

    const generateEntries = () => {

        if(!roomData.users[activeTab]) return;
        const journal = roomData.users[activeTab].journal;

        let entries = {};
        let dates = {};

        let monthFound = false;

        let monthNow = new Date().toLocaleString('default', { month: 'long' });
        let yearNow = new Date().getFullYear().toString();
        dates[yearNow] = [monthNow];

        for(let id in journal) {
            
            const entryDate = journal[id].date;
            const dateSegments = entryDate.split('-');
            const year = dateSegments[0];
            const month = getMonthString(dateSegments[1]);

            if(year === currentYear && month === currentMonth) {
                monthFound = true;
            }
    
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

        if(!monthFound) {
            const {defaultMonth, defaultYear} = getDefaultTime();
            setCurrentMonth(defaultMonth);
            setCurrentYear(defaultYear);
        }
    
        for(let year in entries) {
            for(let month in entries[year]) {
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
            if(!entries[currentYear]) return [];
            if(!entries[currentYear][currentMonth]) return [];
            return entries[currentYear][currentMonth];
        }
    }

    const getSelectedTimeString = () => {
        let timeRange;
        if(!currentMonth || !currentYear) {
            const {defaultMonth, defaultYear} = getDefaultTime();
            timeRange = `${defaultMonth} ${defaultYear}`
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

        let savedMonths = JSON.parse(JSON.stringify(savedActiveMonth));
        savedMonths[activeTab] = {month: currentMonth, year: currentYear};
        setActiveTab(tab);
        setSavedActiveMonth(savedMonths);
        toggleDatePicker(false);
        if(savedMonths[tab]) {
            setCurrentMonth(savedMonths[tab].month);
            setCurrentYear(savedMonths[tab].year);
        }

    }

    const oneUserInRoom = () => {
        if(!roomData) return false;
        return Object.keys(roomData.users).length === 1;
    }   

    useEffect(() => {
        
        if(!roomData) return;

        if(!activeTab) {
            if(userInfo && !roomData.guest && userInRoom()) {
                setActiveTab(userInfo.id);
            } else {
                setActiveTab(parseInt(Object.keys(roomData.users)[0]));
            }
        } else {
            generateEntries();
        }

        if(!currentMonth || !currentYear) {
            const {defaultMonth, defaultYear} = getDefaultTime();
            setCurrentMonth(defaultMonth);
            setCurrentYear(defaultYear);
        }

    }, [roomData, userInfo]);

    useEffect(() => {

        if(activeTab) {
            generateEntries(); 
        }

    }, [activeTab]);

    const userInRoom = () => {
        if(!roomData) return false;
        if(!userInfo) return false;
        if(!roomData.users[userInfo.id]) return false;
        return true;
    }

    if(!roomData) return null;

    let fullScreen = Object.keys(roomData.users).length === 1;
    return (
        <div className={`${styles.journalOuter} ${journalCollapsed ? styles.collapsed : ''} ${todoCollapsed ? styles.expanded : ''}`}>

            <UserTabs 
                activeTab={activeTab}
                setActiveTab={(userId) => setTab(parseInt(userId))}
                collapseDirection={'right'}
                onCollapse={() => onCollapsed(!journalCollapsed)}/>

            {
                journalCollapsed ?
                <div className={styles.expandButton} onClick={() => onCollapsed(!journalCollapsed)}>
                    <TbLayoutSidebarLeftCollapseFilled />
                </div> : null
            }

            {
                (isGuest || oneUserInRoom()) && !journalCollapsed ?
                <div className={styles.collapseButton} onClick={() => onCollapsed(!journalCollapsed)}>
                    <TbLayoutSidebarRightCollapseFilled />
                </div> : null
            }
            
            <div className={styles.journalInner}>
            
                <JournalMonthPicker
                    visible={activeView === 2 && showDatePicker}
                    fullScreen={fullScreen}
                    activeTab={activeTab}
                    years={years}
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    setMonth={(month, year) => setMonth(month, year)}
                    toggleVisible={() => toggleDatePicker(false)} />
            
                <div className={styles.journalContent}>
                    <h2>
                        <div 
                            onClick={() => toggleDatePicker(true)}
                            className={styles.toggleDatePicker}>
                            <FaCalendarAlt/>
                        </div>
                        Journal - {getSelectedTimeString()}
                        {
                            showInput() ?
                            <div
                                onClick={() => setJournalInputCollapsed(!journalInputCollapsed)} 
                                className={styles.toggleJournalCollapse}
                                title={journalInputCollapsed ? "Edit Entry" : "Collapse Entry"}>
                                {
                                    journalInputCollapsed ?
                                    <HiPencilAlt /> : <FaChevronUp />
                                }
                            </div> : null
                        }
                    </h2>

                    {
                        showInput() ? 
                        <JournalInput
                            collapsed={journalInputCollapsed}
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
                                <div>
                                    {
                                        dateToReadable(entry.date)
                                    }
                                </div>
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
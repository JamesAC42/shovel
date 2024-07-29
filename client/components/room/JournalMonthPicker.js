import { MdOutlineExpandMore } from "react-icons/md";
import styles from "../../styles/room/journal.module.scss";
import { useState } from 'react';
import { IoMdExit } from "react-icons/io";

function JournalMonthPicker({
    years,
    currentMonth, 
    currentYear,
    setMonth,
    activeTab,
    visible,
    toggleVisible,
    fullScreen
}) {

    let [collapsedYears, setCollapsedYears] = useState({});

    const toggleCollapse = (year) => {
        let years = JSON.parse(JSON.stringify(collapsedYears));
        if(!activeTab) return;
        if(!years[activeTab]) years[activeTab] = {};
        if(!years[activeTab][year]) {
            years[activeTab][year] = 1;
        } else {
            delete years[activeTab][year];
        }
        setCollapsedYears(years);
    }

    const getMonthStyle = (month, year, cMonth, cYear) => {
        let style = styles.journalMonth;
        if(month === cMonth && year === cYear) {
            style += " " + styles.journalMonthActive;
        }
        return style;
    }

    const yearIsCollapsed = (year) => {
        if(!collapsedYears[activeTab]) return false;
        return collapsedYears[activeTab][year];
    }

    const handleMonthChange = (month, year) => {
        if(years.length === 0) return;
        toggleVisible();
        setMonth(month, year);
    }

    let renderYears = [];
    let cMonth = currentMonth;
    let cYear = currentYear;
    if(years.length === 0) {
        let currentMonth = new Date().toLocaleString('default', { month: 'long' });
        let currentYear = new Date().getFullYear().toString();
        renderYears = [{
            year: currentYear,
            months: [currentMonth]
        }];
        cMonth = currentMonth;
        cYear = currentYear;
    } else {
        renderYears = [...years];
    }

    return (

        <div className={`${styles.journalDates} ${visible ? "" : styles.hideDates} ${
            fullScreen ? styles.fullScreen : ""
        }`}>
            <div className={styles.closeDatePicker}>
                <div
                    onClick={toggleVisible} 
                    className={styles.closeDatePickerBtn}>
                    <IoMdExit/>
                </div>
            </div>
            {
                renderYears.map((year) => 
                    <div
                        key={year.year} 
                        className={`${styles.journalYear} ${
                            yearIsCollapsed(year.year) ? styles.journalYearCollapsed : ''}`}>
                        {year.year}
                        <div
                            onClick={() => toggleCollapse(year.year)} 
                            className={styles.journalYearExpand}>
                            <MdOutlineExpandMore />
                        </div>
                        {
                            year.months.map(month =>
                            <div
                                key={month}
                                onClick={() => handleMonthChange(month, year.year)}
                                className={getMonthStyle(month, year.year, cMonth, cYear)}>
                                {month}
                            </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}
export default JournalMonthPicker;
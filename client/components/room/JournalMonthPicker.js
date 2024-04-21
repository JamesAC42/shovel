import { MdOutlineExpandMore } from "react-icons/md";
import styles from "../../styles/room/journal.module.scss";

function JournalMonthPicker({
    years,
    currentMonth, 
    currentYear,
    setMonth
}) {

    const getMonthStyle = (month, year, cMonth, cYear) => {
        let style = styles.journalMonth;
        if(month === cMonth && year === cYear) {
            style += " " + styles.journalMonthActive;
        }
        return style;
    }

    const handleMonthChange = (month, year) => {
        if(years.length === 0) return;
        setMonth(month, year);
    }

    let renderYears = [];
    let cMonth = currentMonth;
    let cYear = currentYear;
    if(years.length === 0) {
        let currentMonth = new Date().toLocaleString('default', { month: 'long' });
        let currentYear = new Date().getFullYear();
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

        <div className={styles.journalDates}>
            {
                renderYears.map((year) => 
                    <div
                        key={year} 
                        className={styles.journalYear}>
                        {year.year}
                        <div className={styles.journalYearExpand}>
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
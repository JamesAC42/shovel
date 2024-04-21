function getElapsedDays(newDate, oldDate) {

    // newDate = "yyyy/mm/dd"
    // oldDate = "yyyy/mm/dd"

    // Convert the date strings to Date objects
    const d1 = new Date(newDate);
    const d2 = new Date(oldDate);

    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());

    // Convert milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;

}
module.exports = getElapsedDays;
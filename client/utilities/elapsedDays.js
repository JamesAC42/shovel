function elapsedDays(date1, date2) {
    // Convert the date strings to Date objects
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());

    // Convert milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
}
export default elapsedDays;
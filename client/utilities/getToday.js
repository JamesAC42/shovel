function getToday() {
    let date = new Date();
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000))
    date = date.toISOString().split('T')[0];
    return date;
}
export default getToday;
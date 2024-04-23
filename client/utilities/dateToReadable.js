function dateToReadable(dateString) {
    if(!dateString) return "";
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
export default dateToReadable;

function setSavedCustomThemeColors() {
    let savedColors = localStorage.getItem('custom-colors');
    var themeElement = document.querySelector('.theme-parent');
    if (savedColors && themeElement) {
        savedColors = JSON.parse(savedColors);
        Object.keys(savedColors).forEach((key) => {
            themeElement.style.setProperty('--' + key, savedColors[key]);
        });
    }
}

export default setSavedCustomThemeColors;
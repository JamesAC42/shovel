import { useContext, useState } from 'react';
import ThemeContext from '../../pages/ThemeContext';
import { FaPaintBrush } from "react-icons/fa";
import themes from "../../pages/themes";
import styles from "../../styles/room/themepicker.module.scss";

function ThemePicker() {

    const {theme, setTheme} = useContext(ThemeContext);
    const [showThemes, setShowThemes] = useState(false);

    const saveTheme = (t) => {
        try {
            localStorage.setItem('theme', t);
        } catch(err) {
            console.error(err);
        }
        setTheme(t);
    }

    return (
        <div className={styles.themePicker}>
            <div onClick={() => setShowThemes(!showThemes)}>
                <FaPaintBrush />
            </div>
            {
                showThemes ?
                <div className={styles.themes}>
                    <h4>themes</h4>
                    <div className={styles.themeContainer}>
                        {
                            themes.map(t => 
                                <div    
                                    onClick={() => saveTheme(t)} 
                                    className={`${styles.themeItem} ${
                                            theme === t ? 
                                            styles.themeItemActive : ""
                                        } ${styles[t]}`}>
                                    {t}
                                </div> 
                            )
                        }
                    </div>
                </div> : null
            }
        </div>
    )
}
export default ThemePicker;
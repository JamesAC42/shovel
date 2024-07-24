import { useContext, useState } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { FaPaintBrush } from "react-icons/fa";
import { TbPencilPlus } from "react-icons/tb";
import themes from "../utilities/themes";
import styles from "../styles/room/themepicker.module.scss";
import ViewContext from '../contexts/ViewContext';
import setSavedCustomThemeColors from '../utilities/setSavedCustomThemeColors';
import Popup from './Popup';

function ThemePicker() {

    const {theme, setTheme} = useContext(ThemeContext);
    const {view, setView} = useContext(ViewContext);
    const [showThemes, setShowThemes] = useState(false);

    const saveTheme = (t) => {

        if(t === "custom") {
            setSavedCustomThemeColors();
        } else {
            let themeParent = document.querySelector('.theme-parent');
            if(themeParent) {
                themeParent.removeAttribute('style');
            }
        }

        try {
            localStorage.setItem('theme', t);
        } catch(err) {
            console.error(err);
        }
        
        setTheme(t);
    }

    const showCustomThemePicker = () => {
        setShowThemes(false);
        let v = JSON.parse(JSON.stringify(view));
        v.showCustomThemePicker = !v.showCustomThemePicker;
        setView(v);
    }

    return (
        <div className={styles.themePicker}>
            <div onClick={() => setShowThemes(!showThemes)}>
                <FaPaintBrush />
            </div>
            {
                showThemes ?
                
                <Popup onClose={() => setShowThemes(false)}>
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
                            
                            <div    
                                onClick={() => saveTheme('custom')} 
                                className={`${styles.themeItem} ${styles.custom}`}>
                                custom 
                                <div
                                    onClick={() => showCustomThemePicker()} 
                                    className={styles.editCustomTheme}>
                                    <TbPencilPlus/>
                                </div>
                            </div> 
                        </div>
                    </div>
                </Popup> : null
            }
        </div>
    )
}
export default ThemePicker;
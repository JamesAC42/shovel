import { useContext } from 'react';
import ThemeContext from '../../pages/ThemeContext';
import { FaPaintBrush } from "react-icons/fa";
import themes from "../../pages/themes";

function ThemePicker() {

    const {theme, setTheme} = useContext(ThemeContext);
    const [showThemes, setShowThemes] = useState(false);

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
                                    onClick={() => setTheme(t)} 
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
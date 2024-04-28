import { useContext, useEffect, useState } from 'react';
import styles from '../../styles/room/customthemepicker.module.scss';
import ViewContext from '../../contexts/ViewContext';
import { FaWindowClose } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import setSavedCustomThemeColors from '../../utilities/setSavedCustomThemeColors';

const defaultColors = {
    'primary-color': '#888f9d',
    'background-color': '#151518',
    'background-dark': '#050505',
    'background-slightly-dark': '#0a090b',
    'glow': '#c7dcff',
    'secondary-color': '#4b525e',
    'tertiary-color': '#2e3046',
    'error-color': '#f96a6a',
    'link-color': '#5e85b0',
    'tag-color': '#8696be',
    'highlight-color': '#92a5cf',
    'journal-entry-background': '#0c0c0e',
    'approve': '#59a867',
    'decline': '#d15252'
};

function CustomThemePicker() {
    
    const {view, setView} = useContext(ViewContext);
    
    const closeThemePicker = () => {
        let v = JSON.parse(JSON.stringify(view));
        v.showCustomThemePicker = false;
        setView(v);
    }

    let [colors, setColors] = useState(defaultColors);
    let [savedColors, setSavedColors] = useState(null);

    const changesMade = () => {
        let change = false;
        let colorItems = Object.keys(colors);
        if(!savedColors) return true;
        for(let item of colorItems) {
            if(savedColors[item] !== colors[item]) {
                change = true;
                break;
            }
        }
        return change;
    }

    const formatFormName = (input) => {
        let words = input.split('-');
        words = words.map(w => w.charAt(0).toUpperCase() + w.slice(1));
        return words.join(' ');
    }

    const saveColors = () => {

        if(!changesMade()) return;

        localStorage.setItem('custom-colors', JSON.stringify(colors));
        
        var customTheme = document.querySelector('.theme-parent');
        if (customTheme) {
          Object.keys(colors).forEach(function(key) {
            customTheme.style.setProperty('--' + key, colors[key]);
          });
        }
        setSavedColors(colors);
    }

    const resetDefault = () => {
        setColors(defaultColors);
    }

    const saveColor = (type, color) => {
        let c = JSON.parse(JSON.stringify(colors));
        c[type] = color;
        setColors(c);
    }

    useEffect(() => {
        if(view.showCustomThemePicker) {
            let savedColors = localStorage.getItem('custom-colors');
            if(savedColors) {
                savedColors = JSON.parse(savedColors);
                setColors(savedColors);
                setSavedColors(savedColors);
            } else {
                localStorage.setItem('custom-colors',JSON.stringify(colors));
                setSavedCustomThemeColors();
                setSavedColors(colors);
            }
        }
    }, [view]);

    useEffect(() => {

    }, [colors]);

    if(!view.showCustomThemePicker) return <div></div>; 
    
    return(
        <div className={styles.customthemebackground}>
            <div className={styles.customthemeinner}>
                <div className={styles.customthemecontainer}>
                    <div className={styles.customthemeheader}>
                        Customize a Theme
                    </div>
                    <div className={styles.customthemeform}>
                        {
                            Object.keys(colors).map((colorItem) => 
                                <div
                                    key={colorItem} 
                                    className={styles.colorformitem}>
                                    <label>{formatFormName(colorItem)}</label>
                                    <input 
                                        type="color" 
                                        value={colors[colorItem]} 
                                        onChange={(e) => saveColor(colorItem, e.target.value)} />
                                </div>
                            )
                        }
                    </div>
                    <div className={styles.customthemeactions}>
                        <div
                            onClick={() => resetDefault()}
                            className={`${styles.reset}`}>
                            <FaUndo /> Reset Default
                        </div>
                        <div
                            onClick={() => saveColors()} 
                            className={`${styles.save} ${changesMade() ? '' : styles.saveDisabled}`}>
                            <FaSave /> Save
                        </div>
                        <div
                            onClick={() => closeThemePicker()} 
                            className={styles.close}>
                            <FaWindowClose /> Close
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomThemePicker;
import '../styles/global.scss';
import {useState, useEffect} from 'react';
import ThemeContext from '../contexts/ThemeContext';
import UserContext from '../contexts/UserContext';
import ViewContext from '../contexts/ViewContext';
import Script from 'next/script'
import setSavedCustomThemeColors from '../utilities/setSavedCustomThemeColors';

export default function App({ Component, pageProps }) {

    const [theme, setTheme] = useState('default');
    const [userInfo, setUserInfo] = useState(null);
    const [view, setView] = useState({
        showShareBanner: false,
        showCustomThemePicker: false
    });

    useEffect(() => {

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            if(savedTheme === "custom") {
                setSavedCustomThemeColors();
            }
        } else {
            setTheme('default');
        }

    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
        <UserContext.Provider value={{userInfo, setUserInfo}}>
        <ViewContext.Provider value={{view, setView}}>
            <div className={`theme-parent theme-${theme}`}>
                <Script defer src="https://umami.ovel.sh/script.js" data-website-id="e4ae69a4-87b0-4bc9-acc6-abd1e533316f"></Script>
                <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1717794133911955"
                    crossorigin="anonymous"></Script>
                <Component {...pageProps} />
            </div>
        </ViewContext.Provider>
        </UserContext.Provider>
        </ThemeContext.Provider>
    )
}
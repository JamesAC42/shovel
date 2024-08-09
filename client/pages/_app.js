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
        showBanner: false,
        showCustomThemePicker: false
    });
    let intervalId;

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

    useEffect(() => {
        
        const bannerTimer = localStorage.getItem('bannerTimer');
        if(!bannerTimer) {
            localStorage.setItem('bannerTimer', new Date().getTime() + (1000 * 60 * 5));
        }

        if(intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
        
            const bannerTimer = localStorage.getItem('bannerTimer');
            if(bannerTimer) {
                const showTime = parseInt(bannerTimer);
                if (new Date().getTime() > showTime) {
                    let v = JSON.parse(JSON.stringify(view));
                    v.showBanner = true;
                    setView(v);
                    localStorage.setItem('bannerTimer', showTime + (1000 * 60 * 60 * 24 * 7));
                }
            }

        }, 1000 * 60);

        return () => {
            if(intervalId) {
                clearInterval(intervalId);
            }
        }

    }, []);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
        <UserContext.Provider value={{userInfo, setUserInfo}}>
        <ViewContext.Provider value={{view, setView}}>
            <div className={`theme-parent theme-${theme}`}>
                <Script
                    src="https://accounts.google.com/gsi/client"
                    strategy="afterInteractive"
                />
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
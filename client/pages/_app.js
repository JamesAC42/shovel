import '../styles/global.scss';
import {useState, useEffect} from 'react';
import ThemeContext from '../contexts/ThemeContext';
import UserContext from '../contexts/UserContext';
import Script from 'next/script'

export default function App({ Component, pageProps }) {

    const [theme, setTheme] = useState('default');
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme('default');
        }

    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            <div className={`theme-${theme}`}>
                <Script defer src="https://umami.ovel.sh/script.js" data-website-id="e4ae69a4-87b0-4bc9-acc6-abd1e533316f"></Script>
                <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1717794133911955"
                    crossorigin="anonymous"></Script>
                <Component {...pageProps} />
            </div>
        </UserContext.Provider>
        </ThemeContext.Provider>
    )
}
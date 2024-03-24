import '../styles/global.scss';
import {useState} from 'react';
import ThemeContext from './ThemeContext';

export default function App({ Component, pageProps }) {

    const [theme, setTheme] = useState('default');

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <div className={`theme-${theme}`}>
                <Component {...pageProps} />
            </div>
        </ThemeContext.Provider>
    )
}
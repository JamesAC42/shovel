import '../styles/global.scss';
import {useState} from 'react';

export default function App({ Component, pageProps }) {
    const [theme, setTheme] = useState('default');

    const changeTheme = (newTheme) => {
        setTheme(newTheme)
    }

    return (
        <div className={`theme-${theme}`}>
            <Component {...pageProps} changeTheme={changeTheme} />
        </div>
    )
}
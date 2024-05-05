import { useState, useContext } from 'react';
import styles from "../styles/room.module.scss";
import UserContext from '../contexts/UserContext';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {setUserInfo} = useContext(UserContext);

    function submitForm(e) {
        e.preventDefault();
        if (username === "" || password === "") {
            setErrorMessage("Username and password cannot be empty");
            return;
        } else {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUserInfo({...data.user});
                } else {
                    setErrorMessage(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setErrorMessage("An error occurred while logging in.");
            });
        }
    }

    return (
        <div className={styles.login}>
            <h2>Login</h2>
            <form>
                <label>
                    Username:
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <input className={styles.submitForm} type="submit" value="Login" onClick={submitForm} />
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            </form>
        </div>
    )
}
export default Login;
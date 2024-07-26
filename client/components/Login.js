import { useState, useContext } from 'react';
import styles from "../styles/room.module.scss";
import UserContext from '../contexts/UserContext';

function Login() {

    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {setUserInfo} = useContext(UserContext);

    function submitForm(e) {
        e.preventDefault();
        if (user === "" || password === "") {
            setErrorMessage("Fields cannot be empty");
            return;
        } else {
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user,
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
                    Email or Username:
                    <input type="text" value={user} onChange={e => setUser(e.target.value)} />
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
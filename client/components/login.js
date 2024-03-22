import { useState } from 'react';
import styles from "../styles/room.module.scss";

function Login({setUserData}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

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
                    setUserData({
                        id: data.user.id,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        username: data.user.username,
                        color: data.user.color
                    });
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

module.exports = Login;
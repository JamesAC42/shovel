import { useEffect, useContext } from 'react';
import UserContext from '../pages/UserContext';

function UserData() {

    const {setUserInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('/api/room')
            .then(response => {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setUserInfo(data.user);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return(
        <div></div>
    )

}

module.exports = UserData;
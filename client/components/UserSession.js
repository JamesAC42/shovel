import { useEffect, useContext } from 'react';
import UserContext from '../pages/UserContext';

function UserSession() {

    const {userInfo, setUserInfo} = useContext(UserContext);

    useEffect(() => {
        if(userInfo) return;
        fetch('/api/room')
            .then(response => {
                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.success) {
                    console.log(data);
                    console.log("asdf");
                    setUserInfo(data.user);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [userInfo]);
    
    return(
        <div></div>
    )

}

module.exports = UserSession;
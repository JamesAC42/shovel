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
                if (data.success) {
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
export default UserSession;
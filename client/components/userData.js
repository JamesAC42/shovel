import { useEffect } from 'react';
function UserData({setUserData}) {

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
                    setUserData(data.user);
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
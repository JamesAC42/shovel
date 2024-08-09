import postFetch from '../lib/postFetch';
import { useContext, useEffect, useRef, useState } from 'react';
import UserContext from '../contexts/UserContext';

export default function GoogleSignInButton() {
    const buttonRef = useRef(null);

    const {userInfo, setUserInfo} = useContext(UserContext);

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (typeof window !== 'undefined' && window.google && buttonRef.current) {
                google.accounts.id.initialize({
                    client_id: '869282177064-0r5b30b0u81gm4ne6emtt0k9ooh9md2c.apps.googleusercontent.com',
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(
                    buttonRef.current,
                    { theme: "outline", size: "large" }
                );
                google.accounts.id.prompt();
            }
        };

        const handleCredentialResponse = async (response) => {
            
            const loginResponse = await postFetch("/api/googleLogin", {token: response.credential});
            if(loginResponse.success) {
                setUserInfo(loginResponse.user);
            }

        };

        // Check if the Google script is already loaded
        if (window.google) {
            initializeGoogleSignIn();
        } else {
            // If not, wait for it to load
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            script.addEventListener('load', initializeGoogleSignIn);
        }

        return () => {
            const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            script.removeEventListener('load', initializeGoogleSignIn);
        };
    }, []);

    return <div ref={buttonRef}></div>;
}
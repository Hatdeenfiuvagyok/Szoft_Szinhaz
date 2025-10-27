import { useState, useEffect } from 'react';

export function useIsLoggedIn() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return [isLoggedIn, setIsLoggedIn];
}

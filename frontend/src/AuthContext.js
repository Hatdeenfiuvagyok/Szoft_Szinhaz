import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const [user, setUser] = useState(() => {
        const email = localStorage.getItem("userEmail");
        return email ? { email } : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
            const email = localStorage.getItem("userEmail");
            setUser(email ? { email } : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

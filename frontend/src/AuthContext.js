import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return sessionStorage.getItem("isLoggedIn") === "true";
    });

    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem("userEmail");
        return saved ? { email: saved } : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(sessionStorage.getItem("isLoggedIn") === "true");
            const email = sessionStorage.getItem("userEmail");
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

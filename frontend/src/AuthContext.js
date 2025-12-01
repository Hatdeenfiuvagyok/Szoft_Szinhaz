import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("isLoggedIn") === "true";
    });

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("userEmail");
        return saved ? { email: saved } : null;
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

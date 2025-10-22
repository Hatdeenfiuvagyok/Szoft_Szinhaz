import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import theaterImg from './assets/theater.jpg';

export default function Layout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navRef = useRef(null);
    const menuRef = useRef(null);
    const iconRef = useRef(null);
    const navigate = useNavigate();

    // Bezárja a menüt, ha máshová kattintunk
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuOpen &&
                menuRef.current &&
                navRef.current &&
                iconRef.current &&
                !menuRef.current.contains(event.target) &&
                !navRef.current.contains(event.target) &&
                !iconRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // API hívás - Bejelentkezés
    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('Kérjük, töltsd ki mindkét mezőt!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                setIsLoggedIn(true);
                // 2 másodperc után bezárjuk a modalt
                setTimeout(() => {
                    setModalOpen(false);
                    setMessage('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                }, 2000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Bejelentkezési hiba:', error);
            setMessage('Hálózati hiba történt. Próbáld újra később.');
        }
    };

    // API hívás - Regisztráció
    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            setMessage('Kérjük, töltsd ki minden mezőt!');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('A jelszavak nem egyeznek!');
            return;
        }

        if (password.length < 6) {
            setMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(data.message);
                // Sikeres regisztráció után váltunk bejelentkezésre
                setTimeout(() => {
                    setIsRegister(false);
                    setMessage('');
                }, 2000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Regisztrációs hiba:', error);
            setMessage('Hálózati hiba történt. Próbáld újra később.');
        }
    };

    // Form submit kezelése
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    // Modal bezárásakor mezők resetelése
    const handleModalClose = () => {
        setModalOpen(false);
        setMessage('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    // Kijelentkezés
    const handleLogout = () => {
        setIsLoggedIn(false);
        setMessage('Sikeres kijelentkezés!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div
            style={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Háttér */}
            <div
                style={{
                    backgroundImage: `url(${theaterImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)',
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                }}
            />

            {/* Tartalom */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    color: 'white',
                }}
            >
                {/* Navigációs sáv */}
                <nav
                    ref={navRef}
                    style={{
                        backgroundColor: '#333333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 20px',
                        width: '100%',
                        height: '40px',
                        boxSizing: 'border-box',
                    }}
                >
                    <FaBars
                        ref={iconRef}
                        size={26}
                        onClick={() => setMenuOpen(!menuOpen)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#cccccc';
                            e.currentTarget.style.transform = 'scale(1.15)';
                            e.currentTarget.style.transition = 'all 0.2s ease';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s ease',
                        }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isLoggedIn && (
                            <span style={{ marginRight: '10px' }}>
                                Bejelentkezve: {email}
                            </span>
                        )}
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#777777';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.transition = 'all 0.2s ease';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#555555';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#555555',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Kijelentkezés
                            </button>
                        ) : (
                            <button
                                onClick={() => setModalOpen(true)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#777777';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.transition = 'all 0.2s ease';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#555555';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#555555',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                Bejelentkezés
                            </button>
                        )}
                    </div>
                </nav>

                {/* Legördülő menü */}
                {menuOpen && (
                    <div
                        ref={menuRef}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            left: '20px',
                            backgroundColor: '#333333',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                            zIndex: 2,
                        }}
                    >
                        {[
                            { name: 'Csokonai Színház', path: '/home' },
                            { name: 'Vojtina Színház', path: '/home' },
                            { name: 'Vidám Színház', path: '/home' },
                            { name: 'Foglalás', path: '/reservation' },
                            { name: 'Kapcsolat', path: '/home' },
                        ].map((item) => (
                            <div
                                key={item.name}
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate(item.path);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#555555';
                                    e.currentTarget.style.transform = 'translateX(5px)';
                                    e.currentTarget.style.transition = 'all 0.2s ease';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#333333';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    borderBottom: '1px solid #444',
                                    backgroundColor: '#333333',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Üzenet megjelenítése */}
                {message && !modalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '50px',
                            right: '20px',
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            zIndex: 1000,
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Oldal tartalma */}
                <div style={{ flex: 1 }}>{children}</div>

                {/* Bejelentkezés/Regisztráció modal */}
                {modalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 10,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#222',
                                padding: '30px',
                                borderRadius: '10px',
                                width: '300px',
                                color: 'white',
                                position: 'relative',
                            }}
                        >
                            <button
                                onClick={handleModalClose}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                }}
                            >
                                ×
                            </button>

                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                                {isRegister ? 'Regisztráció' : 'Bejelentkezés'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderRadius: '5px',
                                        border: 'none',
                                    }}
                                />

                                <input
                                    type="password"
                                    placeholder="Jelszó"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        marginBottom: isRegister ? '10px' : '15px',
                                        borderRadius: '5px',
                                        border: 'none',
                                    }}
                                />

                                {isRegister && (
                                    <input
                                        type="password"
                                        placeholder="Jelszó újra"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            marginBottom: '15px',
                                            borderRadius: '5px',
                                            border: 'none',
                                        }}
                                    />
                                )}

                                {message && (
                                    <p style={{ color: 'lightcoral', textAlign: 'center', marginBottom: '10px' }}>
                                        {message}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#555555',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                    }}
                                >
                                    {isRegister ? 'Regisztráció' : 'Bejelentkezés'}
                                </button>
                            </form>

                            <p
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setMessage('');
                                    setConfirmPassword('');
                                }}
                                style={{
                                    marginTop: '15px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    color: '#aaa',
                                    fontSize: '14px',
                                }}
                            >
                                {isRegister ? 'Van már fiókod? Bejelentkezés' : 'Nincs fiókod? Regisztráció'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
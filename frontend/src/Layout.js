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
                            e.currentTarget.style.color = '#cccccc';      // világosabb ikon
                            e.currentTarget.style.transform = 'scale(1.15)'; // kicsit nagyobb
                            e.currentTarget.style.transition = 'all 0.2s ease';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'white';        // vissza fehérre
                            e.currentTarget.style.transform = 'scale(1)'; // vissza normál méretre
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'white',
                            transition: 'all 0.2s ease',
                        }}
                    />

                    <button
                        onClick={() => setModalOpen(true)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#777777'; // világosabb szürke
                            e.currentTarget.style.transform = 'scale(1.05)'; // picit nagyobb
                            e.currentTarget.style.transition = 'all 0.2s ease';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#555555'; // vissza az eredeti
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
                                    e.currentTarget.style.backgroundColor = '#555555'; // világosabb háttér
                                    e.currentTarget.style.transform = 'translateX(5px)'; // kicsit elmozdul
                                    e.currentTarget.style.transition = 'all 0.2s ease';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#333333'; // vissza alap
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
                                onClick={() => setModalOpen(false)}
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

                            <p
                                onClick={() => {
                                    setIsRegister(!isRegister);
                                    setMessage('');
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

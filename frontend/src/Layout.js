import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import theaterImg from './assets/theater.jpg';
import { useIsLoggedIn } from './useIsLoggedIn';

export default function Layout({children}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useIsLoggedIn();

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage('Kérjük, töltsd ki mindkét mezőt!');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (data.success) {
                setMessage(data.message);
                setIsLoggedIn(true);
                localStorage.setItem('isLoggedIn', 'true');
                setTimeout(() => {
                    setModalOpen(false);
                    setMessage('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                }, 2000);
            } else setMessage(data.message);
        } catch (error) {
            console.error('Bejelentkezési hiba:', error);
            setMessage('Hálózati hiba történt. Próbáld újra később.');
        }
    };

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
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (data.success) {
                setMessage(data.message);
                setTimeout(() => {
                    setIsRegister(false);
                    setMessage('');
                }, 2000);
            } else setMessage(data.message);
        } catch (error) {
            console.error('Regisztrációs hiba:', error);
            setMessage('Hálózati hiba történt. Próbáld újra később.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        isRegister ? handleRegister() : handleLogin();
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setMessage('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        setMessage('Sikeres kijelentkezés!');
        setTimeout(() => setMessage(''), 3000);
    };

    const menuItems = [
        {name: 'Csokonai Színház', path: '/home'},
        {name: 'Vojtina Színház', path: '/home'},
        {name: 'Vidám Színház', path: '/home'},
        {name: 'Foglalás', path: '/reservation'},
        {name: 'Kapcsolat', path: '/home'},
    ];

    return (
        <div style={{position: 'relative', height: '100vh', width: '100%', overflow: 'hidden'}}>
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
            <div style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                color: 'white'
            }}>
                {/* Navigációs sáv */}
                <nav
                    style={{
                        backgroundColor: '#333333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        height: '60px',
                    }}
                >
                    {/* Bal oldali Színházak */}
                    <div
                        onClick={() => navigate('/home')}
                        style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: 'white'}}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ccc')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                    >
                        Színházak
                    </div>

                    {/* Középső menü */}
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        {menuItems.map((item, index) => (
                            <React.Fragment key={item.name}>
                                <div
                                    onClick={() => navigate(item.path)}
                                    style={{cursor: 'pointer', color: 'white', padding: '0 10px', fontWeight: '500'}}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ccc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                                >
                                    {item.name}
                                </div>
                                {index < menuItems.length - 1 && (
                                    <div style={{
                                        width: '1px',
                                        height: '20px',
                                        backgroundColor: 'rgba(255,255,255,0.3)'
                                    }}/>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Jobb oldali bejelentkezés / kijelentkezés */}
                    <div>
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '5px 15px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#555555',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Kijelentkezés
                            </button>
                        ) : (
                            <button
                                onClick={() => setModalOpen(true)}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#555555',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '15px'
                                }}
                            >
                                Bejelentkezés
                            </button>
                        )}
                    </div>
                </nav>

                {/* Üzenetek */}
                {message && !modalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '70px',
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

                {/* Oldal tartalom */}
                <div style={{flex: 1}}>
                    {children}
                </div>

                {/* Modal */}
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
                                    cursor: 'pointer'
                                }}
                            >
                                ×
                            </button>

                            <h2 style={{
                                textAlign: 'center',
                                marginBottom: '20px'
                            }}>{isRegister ? 'Regisztráció' : 'Bejelentkezés'}</h2>

                            <form onSubmit={handleSubmit}>
                                <input type="email" placeholder="Email" value={email}
                                       onChange={(e) => setEmail(e.target.value)} style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    borderRadius: '5px',
                                    border: 'none'
                                }}/>
                                <input type="password" placeholder="Jelszó" value={password}
                                       onChange={(e) => setPassword(e.target.value)} style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: isRegister ? '10px' : '15px',
                                    borderRadius: '5px',
                                    border: 'none'
                                }}/>
                                {isRegister && <input type="password" placeholder="Jelszó újra" value={confirmPassword}
                                                      onChange={(e) => setConfirmPassword(e.target.value)} style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    borderRadius: '5px',
                                    border: 'none'
                                }}/>}
                                {message && <p style={{
                                    color: 'lightcoral',
                                    textAlign: 'center',
                                    marginBottom: '10px'
                                }}>{message}</p>}
                                <button type="submit" style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#555555',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}>
                                    {isRegister ? 'Regisztráció' : 'Bejelentkezés'}
                                </button>
                            </form>

                            <p onClick={() => {
                                setIsRegister(!isRegister);
                                setMessage('');
                                setConfirmPassword('');
                            }} style={{
                                marginTop: '15px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                color: '#aaa',
                                fontSize: '14px'
                            }}>
                                {isRegister ? 'Van már fiókod? Bejelentkezés' : 'Nincs fiókod? Regisztráció'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

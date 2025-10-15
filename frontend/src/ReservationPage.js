import React, { useState, useEffect, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import theaterImg from './assets/theater.jpg';
import theater1 from './assets/theater1.jpg';
import theater2 from './assets/theater2.jpg';
import theater3 from './assets/theater3.jpg';

export default function ReservationPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const menuRef = useRef(null);
  const iconRef = useRef(null);

  // Bezárás, ha bárhová kattintunk az oldalon a menün kívül
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        menuRef.current &&
        iconRef.current &&
        !menuRef.current.contains(event.target) &&
        !iconRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSelectChange = (theater) => {
    setSelectedTheater(theater);
    setMenuOpen(false);
  };

  const handleLoginRegister = async () => {
    if (isRegister && password !== confirmPassword) {
      setMessage('A jelszavak nem egyeznek!');
      return;
    }

    try {
      const response = await fetch(
        isRegister
          ? 'https://your-backend.com/register'
          : 'https://your-backend.com/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessage(isRegister ? 'Regisztráció sikeres!' : 'Bejelentkezés sikeres!');
        setTimeout(() => {
          setModalOpen(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMessage('');
        }, 1500);
      } else {
        setMessage(data.message || 'Hiba történt');
      }
    } catch (error) {
      console.error(error);
      setMessage('Hiba a kapcsolat során');
    }
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
      {/* Fakó háttér */}
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
        {/* Tetején sötétszürke sáv */}
        <nav
          ref={menuRef} // referenciát adunk a nav-nak
          style={{
            backgroundColor: '#333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            width: '100%',
            height: '40px',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <FaBars
            ref={iconRef} // ikon
            size={24}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ cursor: 'pointer' }}
          />

          <button
            onClick={() => setModalOpen(true)}
            style={{
              padding: '5px 15px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#555555',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              whiteSpace: 'nowrap',
            }}
          >
            Bejelentkezés
          </button>
        </nav>

        {/* Legördülő menü a nav alatt */}
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
            {['Csokonai Színház', 'Vojtjai Színház', 'Vidám Színház', 'Foglalás', 'Kapcsolat'].map((theater) => (
              <div
                key={theater}
                onClick={() => handleSelectChange(theater)}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  color: 'white',
                  whiteSpace: 'nowrap',
                  borderBottom: '1px solid #444',
                }}
              >
                {theater}
              </div>
            ))}
          </div>
        )}

        {/* Üres rész - három kártya */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '20px',
            marginTop: '20px',
            flex: 1,
            marginBottom: '20px',
          }}
        >
          {[{ img: theater1, name: 'Csokonai Színház' },
            { img: theater2, name: 'Vojtina Színház' },
            { img: theater3, name: 'Debreceni Vidám Színház' }].map((theater, i) => (
            <div
              key={i}
              style={{
                flex: '1',
                margin: '0 10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={theater.img}
                  alt={theater.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  padding: '10px 5px',
                }}
              >
                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                  {theater.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal felugró ablak */}
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
                onClick={handleLoginRegister}
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

import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import theaterImg from './assets/theater.jpg';

export default function ReservationPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // siker/hiba üzenet

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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(isRegister ? 'Regisztráció sikeres!' : 'Bejelentkezés sikeres!');
        // Például a token mentése: localStorage.setItem('token', data.token);
        setTimeout(() => {
          setModalOpen(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMessage('');
        }, 1500); // 1,5 mp után bezáródik a modal
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
            style={{
              backgroundColor: '#333333',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              marginTop: '0',
              position: 'absolute',
              top: '40px',
              left: '20px',
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

              {/* Csak regisztrációnál jelszó megerősítés */}
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

              {/* Siker/hiba üzenet */}
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

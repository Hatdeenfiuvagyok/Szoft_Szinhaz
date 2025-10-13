import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import theaterImg from './assets/theater.jpg';
import ReservationPage from './ReservationPage';

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/reservation');
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${theaterImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        padding: '0 20px',
      }}
    >
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        marginBottom: '40px',
        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
      }}>
        Magyar Színházak helyfoglalása
      </h1>

      <button
        onClick={handleClick}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
          marginTop: '20px',
        }}
      >
        Foglalj Most
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </Router>
  );
}

export default App;

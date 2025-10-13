import React, { useState } from 'react';
import theaterImg from './assets/theater.jpg';

export default function ReservationPage() {
  const [selectedTheater, setSelectedTheater] = useState('');

  const handleSelectChange = (e) => {
    setSelectedTheater(e.target.value);
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
        <nav style={{
          backgroundColor: '#333333', // sötétebb szürke
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '10px 20px',
        }}>
          {/* Legördülő menü „...” jelzéssel */}
          <select
            value={selectedTheater}
            onChange={handleSelectChange}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'white',
              backgroundColor: '#333333', // ugyanolyan sötétszürke
              appearance: 'none',
            }}
          >
            <option value="">...</option>
            <option value="szinhaz1">Színház 1</option>
            <option value="szinhaz2">Színház 2</option>
            <option value="szinhaz3">Színház 3</option>
          </select>
        </nav>
      </div>
    </div>
  );
}

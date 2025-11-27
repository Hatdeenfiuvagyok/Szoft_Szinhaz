import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import './scrollableDiv.css';

export default function ReservationPage() {
    const { isLoggedIn } = useAuth();

    const [performances, setPerformances] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [seatMap, setSeatMap] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/performances');
                if (!response.ok) throw new Error('Hiba a lekérés során');
                const data = await response.json();

                const sortedData = data.sort(
                    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
                );
                setPerformances(sortedData);
            } catch (error) {
                console.error('Nem sikerült betölteni az előadásokat:', error);
                setMessage('Nem sikerült betölteni az előadásokat.');
            } finally {
                setLoading(false);
            }
        };
        fetchPerformances();
    }, []);

    const openReservationModal = (performance) => {
        setSelectedPerformance(performance);
        setSelectedSeats([]);

        const layout = generateSeatLayout(performance.totalSeats || 0);
        setSeatMap(layout);
    };

    const closeReservationModal = () => {
        setSelectedPerformance(null);
        setSeatMap(null);
        setSelectedSeats([]);
    };

    const handleSeatClick = (seat) => {
        if (!seat || seat.status !== 'available') return;

        setSelectedSeats((prev) => {
            const exists = prev.some((s) => s.id === seat.id);
            if (exists) return prev.filter((s) => s.id !== seat.id);
            return [...prev, seat];
        });
    };

    const handleConfirmReservation = () => {
        if (selectedSeats.length === 0) {
            setMessage('Válassz ki legalább egy helyet!');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        const totalPrice = selectedPerformance.basePrice * selectedSeats.length;

        setMessage(
            `Foglalás kész: ${selectedPerformance.title} – ${selectedSeats.length} hely, összesen ${totalPrice.toLocaleString()} Ft`
        );

        setTimeout(() => setMessage(''), 5000);
        closeReservationModal();
    };

    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '20px auto',
                    width: '90%',
                    minWidth: '600px',
                    color: 'white',
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    🎭 Elérhető előadások
                </h1>

                {message && (
                    <div
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            color: 'lightgreen',
                            textAlign: 'center',
                            marginBottom: '20px',
                            width: '100%',
                        }}
                    >
                        {message}
                    </div>
                )}

                {loading ? (
                    <p style={{ textAlign: 'center', width: '100%' }}>Betöltés...</p>
                ) : (
                    <div
                        className="scrollableDiv"
                        style={{
                            maxHeight: 'calc(100vh - 200px)',
                            overflowY: 'auto',
                            width: '100%',
                            borderRadius: '8px',
                        }}
                    >
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                            }}
                        >
                            <thead style={{ backgroundColor: '#444' }}>
                                <tr>
                                    <th style={headerStyle}>Dátum</th>
                                    <th style={headerStyle}>Színház</th>
                                    <th style={headerStyle}>Színdarab</th>
                                    <th style={headerStyle}>Ár (Ft)</th>
                                    <th style={headerStyle}>Foglalás</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performances.map((item) => (
                                    <tr
                                        key={item.id}
                                        style={{
                                            backgroundColor: item.id % 2 === 0 ? '#333' : '#2a2a2a',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <td style={cellStyle}>
                                            {new Date(item.dateTime).toLocaleString('hu-HU')}
                                        </td>
                                        <td style={cellStyle}>{item.theater}</td>
                                        <td style={cellStyle}>{item.title}</td>
                                        <td style={cellStyle}>
                                            {item.basePrice.toLocaleString()}
                                        </td>
                                        <td style={cellStyle}>
                                            {isLoggedIn ? (
                                                <button
                                                    onClick={() => openReservationModal(item)}
                                                    style={reserveButtonStyle}
                                                >
                                                    Foglalás
                                                </button>
                                            ) : (
                                                <span style={{ color: 'lightcoral' }}>
                                                    Jelentkezz be
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedPerformance && seatMap && (
                <div style={modalOverlayStyle}>
                    <div style={modalContainerStyle}>

                        {/* Bal oszlop */}
                        <div style={leftColumnStyle}>
                            <h2>{selectedPerformance.title}</h2>
                            <p><strong>Színház:</strong> {selectedPerformance.theater}</p>
                            <p>
                                <strong>Időpont:</strong>{' '}
                                {new Date(selectedPerformance.dateTime).toLocaleString('hu-HU')}
                            </p>
                            <p><strong>Összes férőhely:</strong> {selectedPerformance.totalSeats}</p>

                            <hr style={{ borderColor: '#555' }} />

                            <p><strong>Helyek:</strong> {selectedSeats.length}</p>
                            <p><strong>Jegy ár:</strong> {selectedPerformance.basePrice} Ft</p>
                            <p>
                                <strong>Összesen:</strong>{' '}
                                {(selectedPerformance.basePrice * selectedSeats.length).toLocaleString()} Ft
                            </p>

                            <button
                                onClick={handleConfirmReservation}
                                style={{
                                    marginTop: '20px',
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#4caf50',
                                    color: 'white',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Foglalás véglegesítése
                            </button>

                            <button
                                onClick={closeReservationModal}
                                style={{
                                    marginTop: '10px',
                                    width: '100%',
                                    padding: '8px',
                                    backgroundColor: '#777',
                                    color: 'white',
                                    borderRadius: '6px',
                                    border: 'none',
                                }}
                            >
                                Mégse
                            </button>
                        </div>

                        {/* Jobb oszlop */}
                        <div style={rightColumnStyle}>

                            {/* SZÍNPAD FELÜL */}
                            <div
                                style={{
                                    marginBottom: '8px',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    padding: '4px 0',
                                    borderBottom: '1px solid #666',
                                }}
                            >
                                SZÍNPAD
                            </div>

                            {/* Ülésrend 3 blokkban */}
                            <div style={seatLayoutWrapperStyle}>

                                {/* BAL GALÉRIA */}
                                <div style={leftGalleryStyle}>
                                    {seatMap.left.map((row, idx) => (
                                        <SeatRow
                                            key={`L-${idx}`}
                                            row={row}
                                            alignment="right"
                                            offset={idx}
                                            onSeatClick={handleSeatClick}
                                            selectedSeats={selectedSeats}
                                        />
                                    ))}
                                </div>

                                {/* KÖZÉPSŐ RÉSZ */}
                                <div style={centerBlockStyle}>
                                    {seatMap.center.map((row, idx) => (
                                        <SeatRow
                                            key={`C-${idx}`}
                                            row={row}
                                            alignment="center"
                                            offset={idx}
                                            onSeatClick={handleSeatClick}
                                            selectedSeats={selectedSeats}
                                        />
                                    ))}
                                </div>

                                {/* JOBB GALÉRIA */}
                                <div style={rightGalleryStyle}>
                                    {seatMap.right.map((row, idx) => (
                                        <SeatRow
                                            key={`R-${idx}`}
                                            row={row}
                                            alignment="left"
                                            offset={idx}
                                            onSeatClick={handleSeatClick}
                                            selectedSeats={selectedSeats}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* LÁBLÉC – LEGALUL */}
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <strong>Válaszd ki a helyed!</strong>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '15px',
                                        marginTop: '10px',
                                        fontSize: '12px',
                                    }}
                                >
                                    <Legend color="#4caf50" label="Szabad" />
                                    <Legend color="#b71c1c" label="Nem elérhető" />
                                    <Legend color="#2196f3" label="Kiválasztott" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

/* ====== ÜLÉSREND GENERÁTOR ====== */

function generateSeatLayout(totalSeats) {

    const centerRowSizes = [8, 8, 10, 10, 12, 12, 14, 14, 16, 16];

    const center = centerRowSizes.map((seatCount, rowIndex) =>
        Array.from({ length: seatCount }, (_, i) => ({
            id: `C-${rowIndex + 1}-${i + 1}`,
            label: i + 1,
            status: 'available',
        }))
    );

    const galleryRows = 6;
    const galleryPerRow = 5;

    const enableRightGallery = totalSeats >= 150;
    const enableLeftGallery = totalSeats >= 200;

    const makeRow = (prefix, rowIndex, count, status) =>
        Array.from({ length: count }, (_, i) => ({
            id: `${prefix}-${rowIndex + 1}-${i + 1}`,
            label: i + 1,
            status,
        }));

    const left = [];
    const right = [];
    for (let r = 0; r < galleryRows; r++) {
        left.push(makeRow('L', r, galleryPerRow, enableLeftGallery ? 'available' : 'disabled'));
        right.push(makeRow('R', r, galleryPerRow, enableRightGallery ? 'available' : 'disabled'));
    }

    return { center, left, right };
}

/* ===== KOMPOZIT ÉKELEMEK ===== */

function SeatRow({ row, alignment, offset, onSeatClick, selectedSeats }) {
    const isCenter = alignment === 'center';

    let rowStyle = {
        display: 'flex',
        justifyContent: 'center',     // minden sor középen legyen
        flexDirection: 'row',         // vízszintesen legyenek
        marginBottom: 4,
    };

    if (alignment === 'right') {
        rowStyle.transform = `rotate(12deg)`;
    }

    if (alignment === 'left') {
        rowStyle.transform = `rotate(-12deg)`;
    }

    return (
        <div style={rowStyle}>
            {row.map((seat) => {
                const isSelected = selectedSeats.some((s) => s.id === seat.id);

                let backgroundColor = seat.status === 'available' ? '#4caf50' : '#b71c1c';
                if (isSelected) backgroundColor = '#2196f3';

                const seatStyle = {
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    margin: 2,
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: seat.status === 'available' ? 'pointer' : 'default',
                    backgroundColor,
                };

                return (
                    <div
                        key={seat.id}
                        style={seatStyle}
                        onClick={() => onSeatClick(seat)}
                    >
                        {seat.label}
                    </div>
                );
            })}
        </div>
    );
}

function Legend({ color, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div
                style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    backgroundColor: color,
                }}
            />
            <span>{label}</span>
        </div>
    );
}

/* ===== STÍLUSOK ===== */

const headerStyle = {
    padding: '12px 8px',
    fontWeight: 'bold',
    color: 'white',
    borderBottom: '2px solid #666',
    textAlign: 'center',
};

const cellStyle = {
    padding: '10px 8px',
    borderBottom: '1px solid #555',
};

const reserveButtonStyle = {
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
};

const modalContainerStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    maxHeight: '85%',
    backgroundColor: '#222',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    color: 'white',
};

const leftColumnStyle = {
    flex: '0 0 30%',
    paddingRight: '15px',
    borderRight: '1px solid #444',
    display: 'flex',
    flexDirection: 'column',
};

const rightColumnStyle = {
    flex: '0 0 69%',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const seatLayoutWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: '10px',
};

const leftGalleryStyle = {
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '45px',
};

const rightGalleryStyle = {
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '45px',
};

const centerBlockStyle = {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

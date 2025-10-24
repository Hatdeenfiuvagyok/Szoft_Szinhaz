import React, { useState, useEffect } from 'react';
import Layout from './Layout';

export default function ReservationPage() {
    const [performances, setPerformances] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/performances');
                if (!response.ok) throw new Error('Hiba a lekérés során');
                const data = await response.json();
                setPerformances(data);
            } catch (error) {
                console.error('Nem sikerült betölteni az előadásokat:', error);
                setMessage('Nem sikerült betölteni az előadásokat.');
            } finally {
                setLoading(false);
            }
        };
        fetchPerformances();
    }, []);

    const handleReservation = (title, date) => {
        setMessage(`Sikeres foglalás: "${title}" (${new Date(date).toLocaleString()})`);
        setTimeout(() => setMessage(''), 4000);
    };

    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    margin: '60px auto',
                    width: '80%',
                    color: 'white',
                }}
            >
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    🎭 Elérhető előadások
                </h1>

                {/* Üzenet foglalás után */}
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

                {/* Betöltés közben */}
                {loading ? (
                    <p style={{ textAlign: 'center', width: '100%' }}>Betöltés...</p>
                ) : (
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: 'rgba(50, 50, 50, 0.8)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                        }}
                    >
                        <thead>
                        <tr style={{ backgroundColor: '#444' }}>
                            <th style={headerStyle}>Dátum</th>
                            <th style={headerStyle}>Színház</th>
                            <th style={headerStyle}>Színdarab</th>
                            <th style={headerStyle}>Ár (Ft)</th>
                            <th style={headerStyle}>Foglalás</th>
                        </tr>
                        </thead>

                        <tbody>
                        {performances.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={emptyStyle}>
                                    Nincsenek elérhető előadások.
                                </td>
                            </tr>
                        ) : (
                            performances.map((item) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        backgroundColor:
                                            item.id % 2 === 0 ? '#333' : '#2a2a2a',
                                        textAlign: 'center',
                                    }}
                                >
                                    <td style={cellStyle}>
                                        {new Date(item.dateTime).toLocaleString('hu-HU')}
                                    </td>
                                    <td style={cellStyle}>—</td>
                                    <td style={cellStyle}>{item.title}</td>
                                    <td style={cellStyle}>{item.basePrice.toLocaleString()}</td>
                                    <td style={cellStyle}>
                                        <button
                                            onClick={() =>
                                                handleReservation(item.title, item.dateTime)
                                            }
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#777';
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '#555';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                            style={{
                                                backgroundColor: '#555',
                                                color: 'white',
                                                border: 'none',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            Foglalás
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

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

const emptyStyle = {
    padding: '20px',
    textAlign: 'center',
    color: '#ccc',
    fontStyle: 'italic',
};

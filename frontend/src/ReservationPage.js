import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { useAuth } from './AuthContext';
import './scrollableDiv.css';
import { toast } from "react-toastify";

export default function ReservationPage() {
    const { isLoggedIn, user } = useAuth();
    const [showGallery, setShowGallery] = useState(false);
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPerformance, setSelectedPerformance] = useState(null);
    const [seatMap, setSeatMap] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [dynamicPrice, setDynamicPrice] = useState(null); // ⭐ új

    const [userBookedPerformanceIds, setUserBookedPerformanceIds] = useState(new Set());

    const loadUserReservations = async () => {
        if (!user) return;

        const response = await fetch(
            `http://localhost:8080/api/reservations/user?customerName=${user.email}`
        );

        const data = await response.json();

        const ids = new Set(data.map(r => r.performance.id));
        setUserBookedPerformanceIds(ids);
    };

    // ⭐⭐⭐ Dinamikus ár függvény
    function calculateDynamicPrice(performance, index) {
        let price = performance.basePrice;

        // 2) Előadás előtt 2 nap → +5%
        const now = new Date();
        const perfDate = new Date(performance.dateTime);
        const differenceInDays = (perfDate - now) / (1000 * 60 * 60 * 24);

        if (differenceInDays <= 2) {
            price *= 1.05;
        }

        return Math.round(price / 100)*100;
    }

    // ========================
    //     LOAD PERFORMANCES
    // ========================
    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/performances');
                if (!response.ok) throw new Error('Hiba a lekérés során');
                const data = await response.json();

                const sortedData = data.sort(
                    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
                );
                const now = new Date();

                const upcomingPerformances = sortedData.filter(p =>
                    new Date(p.dateTime) > now
                );
                setPerformances(upcomingPerformances);

            } catch (error) {
                console.error('Nem sikerült betölteni az előadásokat:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformances();
    }, []);

    // töltsük be, amikor user belép
    useEffect(() => {
        if (!isLoggedIn || !user) return;

        const load = async () => {
            const response = await fetch(
                `http://localhost:8080/api/reservations/user?customerName=${user.email}`
            );

            const data = await response.json();
            const ids = new Set(data.map(r => r.performance.id));
            setUserBookedPerformanceIds(ids);
        };

        load();
    }, [isLoggedIn, user]);

    // =====================================
    //         CANCEL RESERVATION
    // =====================================
    const cancelReservation = async (performanceId) => {
        await fetch(
            `http://localhost:8080/api/reservations/cancel?performanceId=${performanceId}&customerName=${user.email}`,
            { method: "DELETE" }
        );

        const newSet = new Set(userBookedPerformanceIds);
        newSet.delete(performanceId);
        setUserBookedPerformanceIds(newSet);

        toast.error("Foglalás törölve!");
    };

    // =====================================
    //         OPEN MODAL (Seats)
    // =====================================
    const openReservationModal = async (performance, index) => {
        setSelectedPerformance(performance);
        setSelectedSeats([]);

        // ⭐ dinamikus ár kiszámítása itt
        const dynPrice = calculateDynamicPrice(performance, index);
        setDynamicPrice(dynPrice);

        const layout = generateSeatLayout(performance.totalSeats || 0);

        const response = await fetch(
            `http://localhost:8080/api/reservations/booked-seats?performanceId=${performance.id}`
        );
        const bookedSeats = await response.json();

        const updateStatus = (rows) =>
            rows.map(row =>
                row.map(seat => {
                    if (bookedSeats.includes(seat.id)) {
                        return { ...seat, status: "unavailable" };
                    }
                    return seat;
                })
            );

        // Csak a középtér frissítése
        layout.center = updateStatus(layout.center);
        layout.gallery = updateStatus(layout.gallery);

        setSeatMap(layout);
    };

    const closeReservationModal = () => {
        setSelectedPerformance(null);
        setSeatMap(null);
        setSelectedSeats([]);
        setDynamicPrice(null); // ⭐ reset
    };

    // =====================================
    //         HANDLE SEAT CLICK
    // =====================================
    const handleSeatClick = (seat) => {
        if (!seat || seat.status !== 'available') return;

        setSelectedSeats((prev) => {
            const exists = prev.some((s) => s.id === seat.id);
            if (exists) return prev.filter((s) => s.id !== seat.id);
            return [...prev, seat];
        });
    };

    // =====================================
    //         CONFIRM RESERVATION
    // =====================================
    const handleConfirmReservation = async () => {
            if (selectedSeats.length === 0) {
                toast.error('Válassz ki legalább egy helyet!');
                return;
            }

            try {
                for (const seat of selectedSeats) {
                    const reservationData = {
                        customerName: user.email,
                        seatId: seat.id,
                        performance: { id: selectedPerformance.id },
                    };

                    console.log(reservationData)

                    await fetch("http://localhost:8080/api/reservations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(reservationData),
                    });
                }
              // sikeres foglalás → frissítsük a listát
                const newSet = new Set(userBookedPerformanceIds);
                newSet.add(selectedPerformance.id);
                setUserBookedPerformanceIds(newSet);

                toast.success("Foglalás sikeres!");
                closeReservationModal();
            } catch (error) {
                console.error(error);
                toast.error("Hiba történt a foglalás közben.");
            }
        };

    // ==============================
    //             RENDER
    // ==============================
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
                                tableLayout: "fixed"
                            }}
                        >
                            <thead style={{backgroundColor: '#444' }}>
                                <tr>
                                    <th style={headerStyle}>Dátum</th>
                                    <th style={headerStyle}>Színház</th>
                                    <th style={headerStyle}>Színdarab</th>
                                    <th style={headerStyle}>Férőhely</th>
                                    <th style={headerStyle}>Alap Ár (Ft)</th>
                                    <th style={headerStyle}>Foglalás</th>
                                </tr>
                            </thead>
                            <tbody>
                                {performances.map((item, index) => (
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
                                        <td style={cellStyle}>{item.totalSeats}</td>
                                        <td style={cellStyle}>
                                            {Number(item.basePrice).toLocaleString()}
                                        </td>
                                        <td style={cellStyle}>
                                            {isLoggedIn ? (
                                                <div style={{
                                                    display: "flex",
                                                    gap: "10px",                 // távolság a gombok között
                                                    justifyContent: "center"     // középre igazítja
                                                }}>

                                                    {/* Foglalás gomb — mindig jelen van */}
                                                    <button
                                                        onClick={() => openReservationModal(item, index)}
                                                        style={{
                                                            ...reserveButtonStyle,
                                                            backgroundColor: "#4caf50",
                                                        }}
                                                    >
                                                        Foglalás
                                                    </button>

                                                    {/* Törlés — csak ha már foglalt */}
                                                    {userBookedPerformanceIds.has(item.id) && (
                                                        <button
                                                            onClick={() => cancelReservation(item.id)}
                                                            style={{
                                                                ...reserveButtonStyle,
                                                                backgroundColor: "#b71c1c",
                                                            }}
                                                        >
                                                            Foglalás törlése
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{ color: "lightcoral" }}>Jelentkezz be</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedPerformance && seatMap && (
                <RenderModal
                    selectedPerformance={selectedPerformance}
                    seatMap={seatMap}
                    selectedSeats={selectedSeats}
                    handleSeatClick={handleSeatClick}
                    handleConfirmReservation={handleConfirmReservation}
                    closeReservationModal={closeReservationModal}
                    dynamicPrice={dynamicPrice} // ⭐ átadjuk
                />
            )}
        </Layout>
    );
}

/* ==========================================================
   A MODAL KOMPONENS
========================================================== */

function RenderModal({
    selectedPerformance,
    seatMap,
    selectedSeats,
    handleSeatClick,
    handleConfirmReservation,
    closeReservationModal,
    dynamicPrice
}) {

    // nézetváltó állapot
    const [showGallery, setShowGallery] = React.useState(false);

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContainerStyle}>
            {/* Jobb felső bezáró X */}
            <button
                onClick={closeReservationModal}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "15px",
                    background: "transparent",
                    border: "none",
                    color: "white",
                    fontSize: "26px",
                    cursor: "pointer"
                }}
            >
                ×
            </button>

                {/* ============================
                    BAL OLDAL — INFO
                ============================ */}
                <div style={leftColumnStyle}>
                    <h2>{selectedPerformance.title}</h2>
                    <p><strong>Színház:</strong> {selectedPerformance.theater}</p>
                    <p><strong>Időpont:</strong> {new Date(selectedPerformance.dateTime).toLocaleString('hu-HU')}</p>
                    <p><strong>Összes férőhely:</strong> {selectedPerformance.totalSeats}</p>
                    <p><strong>Helyek:</strong> {selectedSeats.length}</p>

                    <p><strong>Jegy ár:</strong> {selectedPerformance.basePrice} Ft</p>
                    <p><strong>Összesen:</strong> {(dynamicPrice * selectedSeats.length).toLocaleString()} Ft</p>

                    <button
                        onClick={handleConfirmReservation}
                        style={{
                            marginTop: "20px",
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#4caf50",
                            color: "white",
                            border: "none",
                            borderRadius: "6px"
                        }}
                    >
                        Foglalás véglegesítése
                    </button>

                    <button
                        onClick={closeReservationModal}
                        style={{
                            marginTop: "10px",
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#777",
                            color: "white",
                            border: "none",
                            borderRadius: "6px"
                        }}
                    >
                        Mégse
                    </button>
                </div>

                {/* ============================
                    JOBB OLDAL — NÉZŐTÉR
                ============================ */}
                <div style={rightColumnStyle}>
                    <div
                        style={{
                            height: "40px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        <div
                            style={{
                                textAlign: "center",
                                fontSize: "15px",
                                marginBottom: "6px"
                            }}
                        >
                            Színpad
                        </div>

                        <div
                            style={{
                                width: "100%",
                                height: "1px",
                                backgroundColor: "#666",
                                marginRight: "20px",
                                width: "calc(100% - 20px)"
                            }}
                        ></div>
                    </div>
                    {/* --------------------------
                        GALÉRIA — FÉLKÖR
                    -------------------------- */}
                    {showGallery && (
                        <div
                            style={{
                                position: "relative",
                                width: "650px",
                                height: "350px",
                                margin: "0 auto",
                                marginTop: "0px",
                            }}
                        >
                            {seatMap.gallery.map((row, ri) => (
                                <React.Fragment key={ri}>
                                    {row.map(seat => {
                                        const isSelected = selectedSeats.some(s => s.id === seat.id);

                                        return (
                                            <div
                                                key={seat.id}
                                                onClick={() =>
                                                    seat.status === "available" && handleSeatClick(seat)
                                                }
                                                style={{
                                                    position: "absolute",
                                                    left: seat.x + 325,
                                                    top: 40 + seat.y,
                                                    width: "22px",
                                                    height: "22px",
                                                    borderRadius: "6px",
                                                    backgroundColor:
                                                        seat.status === "unavailable"
                                                            ? "#b71c1c"
                                                            : isSelected
                                                            ? "#2196f3"
                                                            : "#4caf50",
                                                    cursor:
                                                        seat.status === "unavailable"
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    fontSize: "8px",
                                                    color: "black",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                {seat.label}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                    {/* BAL ALSÓ SAROKBAN LÉVŐ KICSI NYÍL */}
                    <button
                        onClick={() => setShowGallery(!showGallery)}
                        style={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid #666",
                            borderRadius: "50%",
                            width: "38px",
                            height: "38px",
                            fontSize: "20px",
                            color: "white",
                            cursor: "pointer",
                            backdropFilter: "blur(3px)"
                        }}
                    >
                        {showGallery ? "▼" : "▲"}
                    </button>
                    {/* --------------------------
                        KÖZÉP NÉZŐTÉR
                    -------------------------- */}
                    {!showGallery && (
                        <div style={{ marginTop: "0px" }}>
                            {seatMap.center.map((row, ri) => (
                                <div
                                    key={ri}
                                    style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}
                                >
                                    {row.map(seat => {
                                        const isSelected = selectedSeats.some(s => s.id === seat.id);

                                        return (
                                            <div
                                                key={seat.id}
                                                onClick={() =>
                                                    seat.status === "available" && handleSeatClick(seat)
                                                }
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "4px",
                                                    margin: "2px",
                                                    backgroundColor:
                                                        seat.status === "unavailable"
                                                            ? "#b71c1c"
                                                            : isSelected
                                                            ? "#2196f3"
                                                            : "#4caf50",
                                                    cursor:
                                                        seat.status === "unavailable"
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    fontSize: "8px",
                                                    color: "black",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                {seat.label}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )
                    }

                    {/* --------------------------
                        JELMAGYARÁZAT
                    -------------------------- */}
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <Legend color="#4caf50" label="Szabad" />
                        <Legend color="#b71c1c" label="Foglalt" />
                        <Legend color="#2196f3" label="Kiválasztott" />
                    </div>

                </div>
            </div>
        </div>
    );
}


/* ==========================================================
   ÜLÉSREND GENERÁTOR + SEATROW + LEGEND + STYLES
========================================================== */

function generateSeatLayout(totalSeats) {

    /* ===============================
       1) KÖZÉP NÉZŐTÉR
    =============================== */
    const seatsPerRow = 25;
    const numberOfRows = 12;

    const center = Array.from({ length: numberOfRows }, (_, r) =>
        Array.from({ length: seatsPerRow }, (_, s) => ({
            id: `C-${r + 1}-${s + 1}`,
            label: s + 1,
            status: "available",
        }))
    );

    /* ===============================
       2) GALÉRIA – TÖBB FÉLKÖR
    =============================== */

    const galleryRows = 5;
    const seatsPerGalleryRow = 25;

    const baseRadius = 200;
    const radiusStep = 30;

    const gallery = [];

    for (let r = 0; r < galleryRows; r++) {

        const radius = baseRadius + r * radiusStep;
        const row = [];

        for (let i = 0; i < seatsPerGalleryRow; i++) {

            const angle = Math.PI * (i / (seatsPerGalleryRow - 1));

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            row.push({
                id: `G-${r + 1}-${i + 1}`,
                label: i + 1,
                status: "available",
                x,
                y
            });
        }

        gallery.push(row);
    }
    // ===============================
    // 3) Felesleges székek tiltása
    // ===============================

    const allSeats = [
        ...gallery.flat(),        // galéria összes széke
        ...center.flat()          // középső rész összes széke
    ];

    const totalGenerated = allSeats.length;
    const extraSeats = totalGenerated - totalSeats;

    // ha több széket generáltunk, mint amennyi kell
    if (extraSeats > 0) {

        let remaining = extraSeats;

        // 3/A – először GALÉRIA székek tiltása (hátulról indulva)
        for (let r = gallery.length - 1; r >= 0 && remaining > 0; r--) {
            for (let i = gallery[r].length - 1; i >= 0 && remaining > 0; i--) {
                gallery[r][i].status = "unavailable";
                remaining--;
            }
        }

        // 3/B – ha még mindig van extra: középső sorokat tiltjuk
        for (let r = center.length - 1; r >= 0 && remaining > 0; r--) {
            for (let i = center[r].length - 1; i >= 0 && remaining > 0; i--) {
                center[r][i].status = "unavailable";
                remaining--;
            }
        }
    }

    return {
        center,
        gallery
    };
}

function SeatRow({ row, alignment, offset, onSeatClick, selectedSeats }) {
    let rowStyle = {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
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

/* STYLES */

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
    position: 'relative',
    display: 'flex',
    width: '100%',
    maxWidth: '1100px',
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

const centerBlockStyle = {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

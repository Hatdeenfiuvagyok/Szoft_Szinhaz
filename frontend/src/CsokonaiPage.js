// CsokonaiPage.jsx
import React from 'react';
import Layout from './Layout';
import csokonaiImg from './assets/theater1.jpg';

export default function CsokonaiPage() {
    return (
        <Layout>
            <div
                style={{
                        padding:'25px',
                        maxWidth: '1300px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                    }}
            >
                <div
                      style={{
                             backgroundColor: 'rgba(0, 0, 0, 0.6)',
                             padding: '20px',
                             borderRadius: '10px',
                             display: 'flex',
                             gap: '20px',
                             alignItems: 'flex-start',
                             Width: '100%',
                             minHeight: '400px',
                         }}
                >
                    {/* Nagy kép bal oldalon */}
                    <img
                        src={csokonaiImg}
                        alt="Csokonai Színház"
                        style={{
                            width: '50%',
                            minWidth: '350px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Jobb oldali rész — hosszú leírás */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '24px', marginBottom: '20px'}}>
                            Csokonai Színház
                        </h1>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A Csokonai Nemzeti Színház Debrecen egyik legismertebb kulturális
                            intézménye, mely több mint másfél évszázada meghatározó szereplője
                            a magyar színházi életnek. Az épület különleges, historizáló
                            architektúrája és belső tereinek gazdag díszítése a város egyik
                            ikonikus látványosságává teszi.
                        </p>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A színház repertoárja széles: klasszikus drámák, modern színházi
                            alkotások, opera-, balett- és musicalelőadások is helyet kapnak
                            benne. A művészeti ensemble kiemelt figyelmet fordít arra, hogy
                            minden korosztály számára értékes és élvezetes produkciókat
                            kínáljon. Az épületben több játszóhely is működik, amelyek
                            különböző stílusú és közönségigényű előadásokat tesznek
                            lehetővé.
                        </p>

                        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                            Elérhetőségek
                        </h2>

                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Cím:</strong> 4024 Debrecen, Kossuth utca 10.
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Telefon:</strong> +36 52 000 000
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Email:</strong> info@csokonaiszinhaz.hu
                        </p>
                        <p style={{ marginTop: '10px', fontSize: '16px' }}>
                            A jegyfoglalás a felső menü „Foglalás” menüpontján keresztül érhető el.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

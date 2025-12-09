// VidamPage.jsx
import React from 'react';
import Layout from './Layout';
import VidamImg from './assets/theater3.jpg';

export default function VidamPage() {
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
                             width: '100%',
                             minHeight: '400px',
                         }}
                >
                    {/* Nagy kép bal oldalon */}
                    <img
                        src={VidamImg}
                        alt="Vidám Színház"
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
                            Vidám Színház
                        </h1>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A Vidám Színház a könnyed, szórakoztató és humoros színpadi műfajok
                            egyik legismertebb hazai otthona. Évtizedek óta meghatározó szereplője
                            a magyar kabaré- és vígjátékhagyománynak, miközben modern, friss
                            előadásokkal is várja a közönséget.
                        </p>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A repertoárban klasszikus bohózatok, zenés vígjátékok, családi
                            előadások és kortárs humoros darabok is megtalálhatók. A társulat célja,
                            hogy minden látogató valódi kikapcsolódást és jókedvet kapjon —
                            legyen szó egy pörgős musicalről vagy egy könnyed esti kabaréról.
                        </p>

                        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                            Elérhetőségek
                        </h2>

                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Cím:</strong> 4024 Debrecen, Vidám tér 5.
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Telefon:</strong> +36 52 111 111
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Email:</strong> info@vidamszinhaz.hu
                        </p>
                        <p style={{ marginTop: '10px', fontSize: '16px' }}>
                            Jegyfoglalás a felső menü „Foglalás” menüpontján keresztül érhető el.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

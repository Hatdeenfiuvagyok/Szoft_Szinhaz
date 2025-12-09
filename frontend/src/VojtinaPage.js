// VojtinaPage.jsx
import React from 'react';
import Layout from './Layout';
import VojtinaImg from './assets/theater2.jpg';

export default function VojtinaPage() {
    return (
        <Layout>
            <div
                style={{
                    padding: '25px',
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
                        src={VojtinaImg}
                        alt="Vojtina Bábszínház"
                        style={{
                            width: '50%',
                            minWidth: '350px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Jobb oldali rész — hosszú leírás  */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
                            Vojtina Bábszínház
                        </h1>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A Vojtina Bábszínház Debrecen egyik legkedveltebb gyermekszínháza,
                            amely hosszú évek óta elkötelezetten ápolja a bábművészet hagyományait.
                            Előadásaik játékosak, kreatívak és érzelmekben gazdagok, így a legkisebbek
                            és a felnőttek számára is maradandó élményt nyújtanak.
                        </p>

                        <p style={{ fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                            A társulat repertoárjában klasszikus mesék, kortárs bábdarabok,
                            zenés előadások és interaktív gyermekprogramok is megtalálhatók.
                            A Vojtina különlegessége, hogy minden produkciója szeretettel és
                            gondossággal készül, a látványvilág pedig a gyerekek képzeletét
                            megmozgatva vezeti be őket a színház csodálatos világába.
                        </p>

                        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>
                            Elérhetőségek
                        </h2>

                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Cím:</strong> 4026 Debrecen, Kálvin tér 13.
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Telefon:</strong> +36 52 417 250
                        </p>
                        <p style={{ marginBottom: '5px', fontSize: '16px' }}>
                            <strong>Email:</strong> info@vojtinababszinhaz.hu
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

import React from 'react';
import Layout from './Layout';
import theater1 from './assets/theater1.jpg';
import theater2 from './assets/theater2.jpg';
import theater3 from './assets/theater3.jpg';

export default function HomePage() {
    return (
        <Layout>
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
        </Layout>
    );
}

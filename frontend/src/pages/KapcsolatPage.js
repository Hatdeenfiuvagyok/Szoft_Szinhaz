import React from 'react';
import Layout from '../pages/Layout';
import member1Img from '../assets/member1Img.jpg';

export default function KapcsolatPage() {
    const teamMembers = [
        {
            img: member1Img,
            name: 'Tóth Gergő',
            phone: '+36 30 111 1111',
            email: 'peter@example.com',
            role: 'kurvara mindent egyedul :)',
        },
        {
            img: member1Img,
            name: 'Jakab Áron',
            phone: '+36 30 222 2222',
            email: 'peter.nagy@example.com',
            role: '..................',
        },
        {
            img: member1Img,
            name: 'Ungvári Dávid',
            phone: '+36 30 333 3333',
            email: 'szabo@example.com',
            role: '...............',
        },
        {
            img: member1Img,
            name: 'Jécsák Tamás',
            phone: '+36 30 444 4444',
            email: 'jecsak13@gmail.com',
            role: '..............',
        },
    ];

    return (
        <Layout>
            <div
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    justifyContent: 'center',
                }}
            >
                {teamMembers.map((member) => (
                    <div
                        key={member.email}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '15px',
                            padding: '20px',
                            width: 'calc(25% - 20px)',   // 4 oszlop
                            minWidth: '250px',
                            textAlign: 'center',
                            boxSizing: 'border-box',
                        }}
                    >
                        <img
                            src={member.img}
                            alt={member.name}
                            style={{
                                width: '150px',       // nagyobb kép
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginBottom: '15px',
                            }}
                        />

                        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>
                            {member.name}
                        </h3>
                        <p style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
                            <strong>Telefon:</strong> {member.phone}
                        </p>
                        <p style={{ margin: '0 0 6px 0', fontSize: '15px' }}>
                            <strong>Email:</strong> {member.email}
                        </p>
                        <p style={{ margin: 0, fontSize: '15px' }}>
                            <strong>Feladat:</strong> {member.role}
                        </p>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
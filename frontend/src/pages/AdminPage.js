import React, { useState } from "react";
import Layout from "../pages/Layout";
import AdminReservationTable from "../pages/AdminReservationTable";

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [setEditPerformance] = useState(null);

    // Hardcoded admin login adatok
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "SuperSecret123";

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            setAuthenticated(true);
        } else {
            alert("Hibás felhasználónév vagy jelszó!");
        }
    };

    return (
        <Layout>

            {/* 🔒 Kattintás blokkolása admin módban */}
            {authenticated && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "60px",
                        zIndex: 50,
                        backgroundColor: "transparent",
                    }}
                />
            )}

            {/* 🔐 Admin login modal */}
            {!authenticated && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 100,
                    }}
                >
                    <form
                        onSubmit={handleLogin}
                        style={{
                            backgroundColor: "#222",
                            padding: "30px",
                            borderRadius: "10px",
                            color: "white",
                            width: "300px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <h2 style={{ textAlign: "center" }}>🔒 Admin Login</h2>

                        <input
                            type="text"
                            placeholder="Felhasználónév"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                padding: 10,
                                borderRadius: 5,
                                border: "none",
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Jelszó"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: 10,
                                borderRadius: 5,
                                border: "none",
                            }}
                        />

                        <button
                            type="submit"
                            style={{
                                padding: 10,
                                borderRadius: 6,
                                border: "none",
                                backgroundColor: "#555",
                                color: "white",
                                cursor: "pointer",
                                marginTop: 10,
                            }}
                        >
                            Belépés
                        </button>
                    </form>
                </div>
            )}

            {/* 🧩 Admin tartalom */}
            {authenticated && (
                <div style={{ paddingTop: "0px" }}>
                    <AdminReservationTable onEdit={setEditPerformance} />
                </div>
            )}
        </Layout>
    );
}

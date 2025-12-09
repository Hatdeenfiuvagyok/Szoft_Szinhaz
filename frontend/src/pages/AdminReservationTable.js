import React, { useState, useEffect } from "react";
import "../css/scrollableDiv.css";

export default function AdminReservationTable() {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newSeatError, setNewSeatError] = useState("");
    const [editSeatError, setEditSeatError] = useState("");

    // szerkesztés állapota
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        title: "",
        theater: "",
        basePrice: "",
        totalSeats: "",
        dateTime: "",
    });

    // új előadás mezők
    const [newPerformance, setNewPerformance] = useState({
        title: "",
        theater: "",
        basePrice: "",
        totalSeats: "",
        dateTime: "",
    });

    // csak akkor lehet hozzáadni, ha minden mező ki van töltve
    const isNewPerformanceValid =
        newPerformance.title.trim() !== "" &&
        newPerformance.theater.trim() !== "" &&
        newPerformance.basePrice !== "" &&
        newPerformance.totalSeats !== "" &&
        newPerformance.dateTime !== "";

    // váltás a nézetek között (future / past)
    const [showPast, setShowPast] = useState(false);

    // adatbetöltés
    useEffect(() => {
        const load = async () => {
            const response = await fetch("http://localhost:8080/api/performances");
            const data = await response.json();
            setPerformances(data);
            setLoading(false);
        };
        load();
    }, []);

    // új sor input kezelő
    const handleChangeNew = (e) => {
        const { name, value } = e.target;

        if (name === "totalSeats") {
            const num = Number(value);

            if (value !== "" && (num < 1 || num > 425)) {
                setNewSeatError("Az értéknek 1 és 425 között kell lennie!");
            } else {
                setNewSeatError("");
            }
        }

        setNewPerformance((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // új előadás hozzáadása
    const handleAddPerformance = async () => {
        if (!isNewPerformanceValid || newSeatError) {
            alert("Kérlek tölts ki minden mezőt helyesen!");
            return;
        }

        const res = await fetch("http://localhost:8080/api/performances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPerformance),
        });

        if (!res.ok) {
            alert("Hiba történt a hozzáadás során!");
            return;
        }

        const saved = await res.json();

        setPerformances((prev) => [...prev, saved]);

        setNewPerformance({
            title: "",
            theater: "",
            basePrice: "",
            totalSeats: "",
            dateTime: "",
        });
        setNewSeatError("");

        alert("Előadás sikeresen hozzáadva!");
    };

    // törlés
    const handleDelete = async (id) => {
        if (!window.confirm("Biztos törlöd az előadást?")) return;

        const res = await fetch(`http://localhost:8080/api/performances/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Hiba történt a törlés során!");
            return;
        }

        setPerformances((prev) => prev.filter((p) => p.id !== id));
    };

    // módosítás indítása
    const startEdit = (item) => {
        setEditId(item.id);
        setEditSeatError("");
        setEditData({
            title: item.title,
            theater: item.theater,
            basePrice: item.basePrice,
            totalSeats: item.totalSeats,
            dateTime: item.dateTime,
        });
    };

    // módosítás értékkezelő
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "totalSeats") {
            const num = Number(value);

            if (value !== "" && (num < 1 || num > 425)) {
                setEditSeatError("Az értéknek 1 és 425 között kell lennie!");
            } else {
                setEditSeatError("");
            }
        }

        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // módosítás mentése
    const saveEdit = async () => {
        if (editSeatError) {
            alert("Kérlek javítsd a hibákat mentés előtt!");
            return;
        }

        const res = await fetch(`http://localhost:8080/api/performances/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editData),
        });

        if (!res.ok) {
            alert("Hiba történt a mentés során!");
            return;
        }

        const updated = performances.map((p) =>
            p.id === editId ? { ...p, ...editData } : p
        );

        setPerformances(updated);
        setEditId(null);
        setEditSeatError("");
    };

    // módosítás törlése
    const cancelEdit = () => {
        setEditId(null);
        setEditSeatError("");
    };

    // szűrés múltbeli / jövőbeli szerint
    const now = new Date();
    const filteredPerformances = performances.filter((p) => {
        const d = new Date(p.dateTime);
        return showPast ? d < now : d >= now;
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "90%",
                margin: "10px auto",
                color: "white",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
                🎭 Admin – Előadások kezelése
            </h1>

            {/* átváltó gomb */}
            <button
                style={{
                    backgroundColor: "#444",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "15px",
                }}
                onClick={() => setShowPast(!showPast)}
            >
                {showPast ? "← Aktuális előadások" : "→ Múltbeli előadások"}
            </button>

            {loading ? (
                <p>Betöltés...</p>
            ) : (
                <div
                    className="scrollableDiv"
                    style={{
                        maxHeight: "calc(100vh - 220px)",
                        overflowY: "auto",
                        width: "100%",
                        borderRadius: "8px",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: "rgba(40,40,40,0.9)",
                        }}
                    >
                        <thead style={{ backgroundColor: "#444" }}>
                            <tr>
                                <th style={headerStyle}>Dátum</th>
                                <th style={headerStyle}>Színház</th>
                                <th style={headerStyle}>Színdarab</th>
                                <th style={headerStyle}>
                                    {showPast ? "Lefoglalt helyek" : "Lefoglalható helyek"}
                                </th>
                                <th style={headerStyle}>Alap Ár</th>
                                <th style={headerStyle}>Művelet</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Új előadás sora – CSAK AKTUÁLIS nézetben */}
                            {!showPast && (
                                <tr style={{ backgroundColor: "#222", textAlign: "center" }}>
                                    <td style={cellStyle}>
                                        <input
                                            type="datetime-local"
                                            name="dateTime"
                                            value={newPerformance.dateTime}
                                            onChange={handleChangeNew}
                                            style={inputStyle}
                                        />
                                    </td>

                                    <td style={cellStyle}>
                                        <select
                                            name="theater"
                                            value={newPerformance.theater}
                                            onChange={handleChangeNew}
                                            style={selectStyle}
                                        >
                                            <option value="">Válassz...</option>
                                            <option value="Csokonai Színház">Csokonai Színház</option>
                                            <option value="Vojtina Színház">Vojtina Színház</option>
                                            <option value="Debreceni Vidám Színház">
                                                Debreceni Vidám Színház
                                            </option>
                                        </select>
                                    </td>

                                    <td style={cellStyle}>
                                        <input
                                            name="title"
                                            value={newPerformance.title}
                                            onChange={handleChangeNew}
                                            style={inputStyle}
                                        />
                                    </td>

                                    <td style={cellStyle}>
                                        <input
                                            type="number"
                                            name="totalSeats"
                                            value={newPerformance.totalSeats}
                                            onChange={handleChangeNew}
                                            style={inputStyle}
                                        />

                                        {newSeatError && (
                                            <div style={{ color: "red", fontSize: "12px" }}>
                                                {newSeatError}
                                            </div>
                                        )}
                                    </td>

                                    <td style={cellStyle}>
                                        <input
                                            type="number"
                                            name="basePrice"
                                            value={newPerformance.basePrice}
                                            onChange={handleChangeNew}
                                            style={inputStyle}
                                        />
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                            style={{
                                                ...saveButtonStyle,
                                                opacity:
                                                    !isNewPerformanceValid || newSeatError ? 0.5 : 1,
                                                cursor:
                                                    !isNewPerformanceValid || newSeatError
                                                        ? "not-allowed"
                                                        : "pointer",
                                            }}
                                            disabled={!isNewPerformanceValid || !!newSeatError}
                                            onClick={handleAddPerformance}
                                        >
                                            Hozzáadás
                                        </button>
                                    </td>
                                </tr>
                            )}

                            {/* Lista elemei */}
                            {filteredPerformances.map((item) => {
                                const isEditing = editId === item.id;

                                return (
                                    <tr
                                        key={item.id}
                                        style={{
                                            backgroundColor:
                                                item.id % 2 === 0 ? "#333" : "#2a2a2a",
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* DÁTUM */}
                                        <td style={cellStyle}>
                                            {isEditing ? (
                                                <input
                                                    type="datetime-local"
                                                    name="dateTime"
                                                    value={editData.dateTime}
                                                    onChange={handleChange}
                                                    style={inputStyle}
                                                />
                                            ) : (
                                                new Date(item.dateTime).toLocaleString("hu-HU")
                                            )}
                                        </td>

                                        {/* SZÍNHÁZ */}
                                        <td style={cellStyle}>
                                            {isEditing ? (
                                                <select
                                                    name="theater"
                                                    value={editData.theater}
                                                    onChange={handleChange}
                                                    style={selectStyle}
                                                >
                                                    <option value="Csokonai Színház">
                                                        Csokonai Színház
                                                    </option>
                                                    <option value="Vojtina Színház">
                                                        Vojtina Színház
                                                    </option>
                                                    <option value="Debreceni Vidám Színház">
                                                        Debreceni Vidám Színház
                                                    </option>
                                                </select>
                                            ) : (
                                                item.theater
                                            )}
                                        </td>

                                        {/* CÍM */}
                                        <td style={cellStyle}>
                                            {isEditing ? (
                                                <input
                                                    name="title"
                                                    value={editData.title}
                                                    onChange={handleChange}
                                                    style={inputStyle}
                                                />
                                            ) : (
                                                item.title
                                            )}
                                        </td>

                                        {/* HELYEK (függ a nézettől) */}
                                        <td style={cellStyle}>
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        name="totalSeats"
                                                        value={editData.totalSeats}
                                                        onChange={handleChange}
                                                        style={inputStyle}
                                                    />

                                                    {editSeatError && (
                                                        <div
                                                            style={{
                                                                color: "red",
                                                                fontSize: "12px",
                                                            }}
                                                        >
                                                            {editSeatError}
                                                        </div>
                                                    )}
                                                </>
                                            ) : showPast ? (
                                                <>
                                                    <div>Lefoglalható: {item.totalSeats}</div>
                                                    <div>Lefoglalt: {item.bookedCount}</div>
                                                </>
                                            ) : (
                                                <div>{item.totalSeats}</div>
                                            )}
                                        </td>

                                        {/* ÁR */}
                                        <td style={cellStyle}>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    name="basePrice"
                                                    value={editData.basePrice}
                                                    onChange={handleChange}
                                                    style={inputStyle}
                                                />
                                            ) : (
                                                item.basePrice + " Ft"
                                            )}
                                        </td>

                                        {/* MŰVELETEK */}
                                        <td style={cellStyle}>
                                            {!showPast ? (
                                                !isEditing ? (
                                                    <>
                                                        <button
                                                            style={editButtonStyle}
                                                            onClick={() => startEdit(item)}
                                                        >
                                                            Módosítás
                                                        </button>
                                                        <button
                                                            style={deleteButtonStyle}
                                                            onClick={() =>
                                                                handleDelete(item.id)
                                                            }
                                                        >
                                                            Törlés
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            style={saveButtonStyle}
                                                            onClick={saveEdit}
                                                            disabled={!!editSeatError}
                                                        >
                                                            Mentés
                                                        </button>
                                                        <button
                                                            style={cancelButtonStyle}
                                                            onClick={cancelEdit}
                                                        >
                                                            Mégse
                                                        </button>
                                                    </>
                                                )
                                            ) : (
                                                // múltbeli nézet — csak törlés
                                                <button
                                                    style={deleteButtonStyle}
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    Törlés
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ----------------------------- */
/* STÍLUSOK */
/* ----------------------------- */

const headerStyle = {
    padding: "12px 8px",
    color: "white",
    fontWeight: "bold",
    borderBottom: "2px solid #666",
    textAlign: "center",
};

const cellStyle = {
    padding: "8px",
    borderBottom: "1px solid #555",
};

const inputStyle = {
    width: "90%",
    padding: "5px",
    borderRadius: "4px",
    border: "none",
};

const selectStyle = {
    width: "95%",
    padding: "5px",
    borderRadius: "4px",
    border: "none",
};

const editButtonStyle = {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
};

const deleteButtonStyle = {
    backgroundColor: "#b71c1c",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

const saveButtonStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
};

const cancelButtonStyle = {
    backgroundColor: "#999",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

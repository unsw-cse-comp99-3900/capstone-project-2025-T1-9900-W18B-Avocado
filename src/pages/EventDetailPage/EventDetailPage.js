// EventDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EventDetailPage.css";
import { AiOutlineArrowLeft, AiOutlineClockCircle } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Button, Snackbar, Alert } from "@mui/material";

function EventDetailPage() {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const [event, setEvent] = useState(null);
    const [showRewards, setShowRewards] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    useEffect(() => {
        try {
        const savedEvent = localStorage.getItem("eventDetail");
        if (savedEvent) {
            const parsed = JSON.parse(savedEvent);
            if (parsed && parsed.id === numericId) {
            setEvent(parsed);
            } else {
            setError("Event data mismatch or not found.");
            }
        } else {
            setError("No event data found in localStorage.");
        }
        } catch (err) {
        console.error("解析 eventDetail 出错：", err);
        setError("Failed to load event detail");
        } finally {
        setLoading(false);
        }
    }, [numericId]);

    // ✅ 向后端发送报名数据
    const sendRegistrationsToBackend = async (registrations) => {
        try {
        const response = await fetch("http://localhost:7000/api/submit_registrations", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: 123, registrations })
        });

        if (response.ok) {
            const result = await response.json();
            console.log("✅ 成功提交报名数据：", result);
        } else {
            console.error("❌ 提交失败：", response.status);
        }
        } catch (error) {
        console.error("⚠️ 网络错误：", error);
        }
    };

    // ✅ 点击报名
    const handleAttend = () => {
        const now = new Date();
        const start = new Date(event.time);
        const end = new Date(event.end_time);

        if (end < now) {
        setSnackbarMsg("This event has already ended.");
        setOpenSnackbar(true);
        return;
        }

        const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
        const alreadyRegistered = registrations.some(r => r.eventId === numericId);

        if (alreadyRegistered) {
        setSnackbarMsg("You have already registered for this event!");
        setOpenSnackbar(true);
        return;
        }

        const newRegistration = {
        eventId: numericId,
        title: event.title,
        time: event.time,
        image: event.image,
        userId: 123
        };

        const updated = [...registrations, newRegistration];
        localStorage.setItem("registrations", JSON.stringify(updated));

        // ⬇️ 向后端发送数据
        sendRegistrationsToBackend(updated);

        setSnackbarMsg("Successfully registered!");
        setOpenSnackbar(true);
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>出错啦：{error}</h2>;

    return (
        <div className="event-detail-page">
        <Header />

        <div className="event-detail-container">
            <Link to="/home" className="back-button">
            <AiOutlineArrowLeft /> Back to Home
            </Link>

            <div className="event-layout">
            <div className="event-image-container">
                <div className="event-booking">Booking the event</div>
                <img
                src={event.image && event.image.trim() !== "" ? event.image : "/logo.png"}
                alt={event.title}
                className="event-image"
                />
            </div>

            <div className="event-info-container">
                <h1 className="event-title">{event.title}</h1>
                <p className="event-summary">{event.summary}</p>

                <div className="event-tags">
                <strong>Tag(s):</strong>{" "}
                {Array.isArray(event.tags) ? event.tags.join(", ") : event.tags}
                </div>

                <div className="event-meta">
                <p><strong>📍 Location:</strong> {event.location || "TBD"}</p>
                <p>
                    <AiOutlineClockCircle /> <strong>Date & Time:</strong>{" "}
                    {new Date(event.time).toLocaleString()} – {new Date(event.end_time).toLocaleString()}
                </p>
                </div>

                <p className="event-description">{event.description || "Join us for a great event!"}</p>

                <Button
                variant="contained"
                onClick={() => setShowRewards(true)}
                sx={{ marginTop: 2 }}
                >
                View Earnable Rewards
                </Button>
            </div>
            </div>

            <div className="attend-section">
            <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleAttend}
                sx={{ mt: 2 }}
            >
                Attend
            </Button>
            </div>

            {showRewards && (
            <div className="rewards-popup">
                <div className="rewards-content">
                <h2>Earnable Rewards</h2>
                <ul>
                    {typeof event.rewards === "object" ? (
                    Object.entries(event.rewards).map(([cat, pts], idx) => (
                        <li key={idx}><strong>{cat}</strong>: {pts} pts</li>
                    ))
                    ) : (
                    <li><strong>Reward</strong>: {event.rewards} pts</li>
                    )}
                </ul>
                <Button
                    onClick={() => setShowRewards(false)}
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    OK
                </Button>
                </div>
            </div>
            )}
        </div>

        {/* ✅ Snackbar 提示 */}
        <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
            >
            {snackbarMsg}
            </Alert>
        </Snackbar>

        <Footer />
        </div>
    );
}

export default EventDetailPage;

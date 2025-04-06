// EventDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EventDetailPage.css";
import { AiOutlineArrowLeft, AiOutlineClockCircle } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function EventDetailPage() {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const [event, setEvent] = useState(null);
    const [showRewards, setShowRewards] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>出错啦：{error}</h2>;

    const handleAttend = () => {
        const now = new Date();
        const start = new Date(event.time);
        const end = new Date(event.end_time);

        if (end < now) {
            alert("This event has already ended. Registration is closed.");
            return;
        }

        const registrations = JSON.parse(localStorage.getItem("registrations")) || [];
        const alreadyRegistered = registrations.some(r => r.eventId === numericId);

        if (alreadyRegistered) {
            alert("You have already registered for this event!");
            return;
        }

        const newRegistration = {
            eventId: numericId,
            title: event.title,
            time: event.time,
            image: event.image,
            userId: 123
        };

        registrations.push(newRegistration);
        localStorage.setItem("registrations", JSON.stringify(registrations));
        alert("Successfully registered!");
    };

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
                            <strong>Tag(s):</strong> {Array.isArray(event.tags) ? event.tags.join(", ") : event.tags}
                        </div>

                        <div className="event-meta">
                            <p><strong>📍 Location:</strong> {event.location || "TBD"}</p>
                            <p>
                                <AiOutlineClockCircle /> <strong>Date & Time:</strong>{" "}
                                {new Date(event.time).toLocaleString()} – {new Date(event.end_time).toLocaleString()}
                            </p>
                        </div>

                        <p className="event-description">{event.description || "Join us for a great event!"}</p>

                        <button className="rewards-button" onClick={() => setShowRewards(true)}>View Earnable Rewards</button>
                    </div>
                </div>

                <div className="attend-section">
                    <button className="attend-button" onClick={handleAttend}>Attend</button>
                </div>

                {showRewards && (
                    <div className="rewards-popup">
                        <div className="rewards-content">
                            <h2>Earnable Rewards</h2>
                            <ul>
                                {typeof event.rewards === "object" ? (
                                    Object.entries(event.rewards)
                                        .map(([cat, points], idx) => (
                                            <li key={idx}><strong>{cat}</strong>: {points} pts</li>
                                        ))
                                ) : (
                                    <li><strong>Reward</strong>: {event.rewards} pts</li>
                                )}
                            </ul>
                            <button className="close-button" onClick={() => setShowRewards(false)}>OK</button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default EventDetailPage;

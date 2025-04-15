// EventDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import "./EventDetailPage.css";
import { AiOutlineArrowLeft, AiOutlineClockCircle } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Button,Box, Chip, Snackbar, Alert } from "@mui/material";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

function EventDetailPage() {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [showRewards, setShowRewards] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [ticketId, setTicketId] = useState(null);

    

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
            
            setError("Failed to load event detail");
        } finally {
            setLoading(false);
        }
    }, [numericId]);

    
    const sendRegistrationsToBackend = async (eventID) => {
        try {
            const token = localStorage.getItem("token");
        
            const response = await fetch("http://localhost:7000/event/attend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ eventId: eventID}), //根据 token 解出 studentID
            });
        
            const result = await response.json();

            // success
            if (response.status === 201) {
                //  Dialog
                setDialogMsg("Successfully registered!");
                setTicketId(result.ticketId || "N/A");
                setDialogOpen(true);
            } else {
                
                setSnackbarMsg(result.error || "Registration failed.");
                setOpenSnackbar(true);
            }
        } catch (error) {
            // network error
            console.error("Network error:", error);
            setSnackbarMsg("Network error. Please try again later.");
            setOpenSnackbar(true);
        }
    };
            

    const handleAttend = async () => {
        const now = new Date();
        const end = new Date(event.end_time);
    
        if (end < now) {
            setSnackbarMsg("This event has already ended.");
            setOpenSnackbar(true);
            return;
        }
    
        sendRegistrationsToBackend(numericId);
    };


    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>error:{error}</h2>;

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

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 , justifyContent: "center"}}>
                        {(Array.isArray(event.tags) ? event.tags : event.tag ? [event.tag] : []).map((tag, idx) => (
                            <Chip key={idx} label={tag} variant="outlined" />
                        ))}
                    </Box>

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
            {/* Dialog for registration feedback */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{dialogMsg}</DialogTitle>
                <DialogContent>
                    {ticketId && (
                    <Box sx={{ mt: 1 }}>
                        <strong>Ticket Number:</strong> {ticketId}
                    </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    {ticketId && (
                    <Button onClick={() => navigate("/schedule/today")} variant="contained" color="primary">
                        View My Schedule
                    </Button>
                    )}
                </DialogActions>
            </Dialog>

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

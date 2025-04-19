import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetailPage.css";
import formatDate from "../../components/Functions/formatDate";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { ErrAlert, SuccessAlert } from "../../components/AlertFormats";

import {
    Box,
    Typography,
    Grid,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import skillMap from "../../components/Functions/skillMap";

function EventDetailPage() {
    const { id } = useParams();
    const numericId = parseInt(id, 10);
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [ticketId, setTicketId] = useState(null);

    useEffect(() => {
        try {
            const savedEvent = localStorage.getItem("eventDetail");
            if (savedEvent) {
                const raw = JSON.parse(savedEvent);
                if (raw && (raw.eventID === numericId || raw.id === numericId)) {
                    let rewards = [];

                    if (typeof raw.rewards === "object" && !Array.isArray(raw.rewards)) {
                        rewards = Object.entries(raw.rewards)
                            .filter(([abbr]) => skillMap[abbr])
                            .map(([abbr, value]) => ({
                                abbr,
                                full: skillMap[abbr],
                                value: Number(value),
                            }));
                    } else if (Array.isArray(raw.rewards)) {
                        rewards = raw.rewards.map(({ abbr, value }) => ({
                            abbr,
                            full: skillMap[abbr] || abbr,
                            value: Number(value),
                        }));
                    } else {
                        const rewardKeys = Object.keys(raw).filter(k => skillMap[k]);
                        rewards = rewardKeys.map((abbr) => ({
                            abbr,
                            full: skillMap[abbr],
                            value: Number(raw[abbr]),
                        }));
                    }

                    const transformed = {
                        id: raw.eventID || raw.id,
                        title: raw.name || raw.title,
                        summary: raw.summary,
                        time: raw.startTime || raw.time,
                        end_time: raw.endTime || raw.end_time,
                        image: raw.image,
                        location: raw.location,
                        tags: Array.isArray(raw.tag) ? raw.tag : (Array.isArray(raw.tags) ? raw.tags : [raw.tag || "Attended"]),
                        description: raw.description || "",
                        rewards: rewards,
                        organizer: raw.organizer || "",
                    };

                    setEvent(transformed);
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
                body: JSON.stringify({ eventId: eventID }),
            });
            const result = await response.json();

            if (response.status === 201) {
                setDialogMsg("Successfully registered!");
                setTicketId(result.ticketId || "N/A");
                setDialogOpen(true);
            } else {
                setSnackbar({ open: true, type: "error", message: "Registration failed." });
            }
        } catch (error) {
            console.error("Network error:", error);
            setSnackbar({ open: true, type: "error", message: "Network error. Please try again." });
        }
    };

    const handleAttend = async () => {
        const now = new Date();
        const end = new Date(event.end_time);
        if (end < now) {
            setSnackbar({ open: true, type: "error", message: "This event has already ended." });
            return;
        }
        sendRegistrationsToBackend(numericId);
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <>
            <Box className="event-detail-page">
                <Header />
                <Box className="event-detail-wrapper">
                    <Box className="event-detail-content" >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
                            {/* buttons sets */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/home")}
                                    className="back-to-dashboard-button"
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate("/events")}
                                    className="back-to-events-button"
                                >
                                    Explore Events
                                </Button>
                            </Box>

                            {/* Hosted By */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: { xs: 1, md: 0 } }}>
                                <Typography variant="body2" fontWeight={600}>
                                    Hosted By{" "}
                                    <Typography component="span" variant="body1" sx={{ color: "#235858", fontWeight: 600, pr: 1 }}>
                                        {event.organizer}
                                    </Typography>
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="event-detail-part1">
                            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                                {event.title}
                            </Typography>
                            {/* Right: Tags */}
                            <Box display="flex" alignItems="center" justifyContent="flex-end" flexWrap="wrap" sx={{ gap: 1, pr: 0.5, mb: 1 }}>
                                <Typography variant="body2" fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>
                                    <strong>Tag:</strong>
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={0.5}
                                    useFlexGap
                                    flexWrap="wrap"
                                    sx={{ flexShrink: 0 }}
                                >
                                    {(Array.isArray(event.tags) ? event.tags : event.tag ? [event.tag] : []).map((tag, idx) => (
                                        <Chip
                                            className="event-detail-tag-chip"
                                            key={`tag-${idx}`}
                                            label={tag}
                                            size="small"
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                        <Grid container spacing={4} alignItems="stretch" sx={{ padding: 0.5 }}>
                            <Grid item xs={12} md={7.5}>
                                <Box className="event-detail-image-container">
                                    <img
                                        src={event.image && event.image.trim() !== "" ? event.image : "/WhatsOnLogo.png"}
                                        alt={event.title}
                                        className="event-detail-image"
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4.5}>
                                <Box className="event-detail-part2">
                                    <Box className="event-info-group">
                                        {/* Time */}
                                        <Box className="event-info-block">
                                            <AccessTimeIcon className="event-info-icon" />
                                            <Box className="event-info-text">
                                                <Typography variant="subtitle1" sx={{ padding: "5px", fontWeight: "bold", color: " #616161" }}>
                                                    {formatDate(event.time)} — {formatDate(event.end_time)} AEST
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {/* Location */}
                                        <Box className="event-info-block">
                                            <LocationOnIcon className="event-info-icon" />
                                            <Box className="event-info-text">
                                                <Typography variant="subtitle1" sx={{ padding: "5px", fontWeight: "bold", color: " #616161" }}>
                                                    {event.location}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Typography
                                        variant="h5"
                                        color="text.secondary"
                                        sx={{ minWidth: "300px", mt: 3, mb: 2, display: "flex", justifyContent: "center", alignItems: "center" }}
                                    >
                                        {event.summary || ""}
                                    </Typography>
                                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                                        {Array.isArray(event.rewards) &&
                                            [...event.rewards]
                                                .sort((a, b) => b.value - a.value)
                                                .map((reward, idx) => (
                                                    <Box
                                                        key={`reward-${idx}`}
                                                        className={`event-reward-label ${reward.abbr}`}
                                                    >
                                                        {reward.full} + {reward.value}
                                                    </Box>
                                                ))}
                                    </Stack>

                                </Box>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" className="event-description" sx={{ px: 1, pt: 2 }}>
                            {event.description || "Join us for a great event!"}
                        </Typography>
                        <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button variant="contained" className="attend-button" onClick={handleAttend}>
                                Attend
                            </Button>
                        </Box>
                    </Box>
                </Box>

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
                            <Button onClick={() => navigate("/schedule/today")} variant="contained" color="success">
                                View My Schedule
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
                {snackbar.type === "error" && <ErrAlert open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />}
                <Footer />
            </Box>
        </>
    );
}

export default EventDetailPage;

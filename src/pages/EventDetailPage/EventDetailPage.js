import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetailPage.css";
import formatDate from "../../components/Functions/formatDate";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
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
    Snackbar,
    Alert,
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
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [ticketId, setTicketId] = useState(null);

    useEffect(() => {
        try {
            const savedEvent = localStorage.getItem("eventDetail");
            if (savedEvent) {
                const raw = JSON.parse(savedEvent);
                if (raw && raw.eventID === numericId) {
                    const rewardKeys = Object.keys(raw).filter(k => skillMap[k]);
                    const rewards = rewardKeys.map((abbr) => ({
                        abbr,
                        full: skillMap[abbr],
                        value: raw[abbr],
                    }));

                    const transformed = {
                        id: raw.eventID,
                        title: raw.name,
                        summary: raw.summary,
                        time: raw.startTime,
                        end_time: raw.endTime,
                        image: raw.image,
                        location: raw.location,
                        tags: raw.tag,
                        description: raw.description || "",
                        rewards: rewards
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
                setSnackbarMsg(result.error || "Registration failed.");
                setOpenSnackbar(true);
            }
        } catch (error) {
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

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <>
            <Box className="event-detail-page">
                <Header />
                <Box className="event-detail-wrapper">
                    <Box className="event-detail-content" >
                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                        <Box className="event-detail-part1">
                            <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                                {event.title}
                            </Typography>

                            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ mt: 1, gap: 2, mb: 1, pl: 0.3 }}>
                                {/* Left: Summary */}
                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ flexGrow: 1, minWidth: 200 }}
                                >
                                    {event.summary || ""}
                                </Typography>

                                {/* Right: Tags */}
                                <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ gap: 1 }}>
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
                        </Box>
                        <Grid container spacing={4} alignItems="center" sx={{ padding: 0.5 }}>
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
                                <Box display="flex" flexDirection="column" justifyContent="center" height="100%" gap={2} mt={2}>
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
                                    <Typography variant="body1" className="event-description">
                                        {event.description || "Join us for a great event!"}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2, pl: 0.3 }}>
                            {Array.isArray(event.rewards) &&
                                event.rewards.map((reward, idx) => (
                                    <Box
                                        key={`reward-${idx}`}
                                        className={`event-reward-label ${reward.abbr}`}
                                    >
                                        {reward.full} + {reward.value}
                                    </Box>
                                ))}
                        </Stack>
                        <Box mt={4} sx={{display:"flex", justifyContent:"center"}}>
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
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
                        {snackbarMsg}
                    </Alert>
                </Snackbar>
                <Footer />
            </Box>
        </>
    );
}

export default EventDetailPage;
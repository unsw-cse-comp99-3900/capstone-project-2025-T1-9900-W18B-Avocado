import React, { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import "./EventDetailPage.css";
import { AiOutlineArrowLeft, AiOutlineClockCircle } from "react-icons/ai";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Typography,
    Container,
    Grid,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Paper,
    Backdrop,Divider,Stack
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import skillMap from "../../components/Functions/skillMap";

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
                const raw = JSON.parse(savedEvent);
                if (raw && raw.eventID === numericId) {
                    // 转换字段结构
                    const rewardKeys = Object.keys(raw).filter(k => skillMap[k]);
                    const rewards = rewardKeys.reduce((acc, k) => {
                        acc[skillMap[k]] = raw[k];
                        return acc;
                    }, {});
    
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
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f4fff1", display: "flex", flexDirection: "column" }}>
            <Header />
            <Box sx={{ flexGrow: 1 }}>
                <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 4 }, maxWidth: { xs: "100%", sm: "100%", md: "960px", lg: "1300px" } }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        variant="contained"
                        onClick={() => navigate("/home")}
                        sx={{ mb: 3, textTransform: "none", fontWeight: "bold", color: "primary", "&:hover": { borderColor: "#1565c0" } }}
                    >
                        Back to Home
                    </Button>

                    <Paper elevation={4} sx={{ borderRadius: 4, p: 6, bgcolor: "white", minHeight: "72vh", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                        <Typography variant="h5" fontWeight="bold" mb={4}>Booking the event</Typography>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={4} alignItems="center">
                                <Grid item xs={12} md={6.5}>
                                    <Box sx={{ transition: "transform 0.3s", '&:hover': { transform: "scale(1.03)" } }}>
                                        <img src={event.image && event.image.trim() !== "" ? `http://localhost:7000${event.image}`: "/WhatsOnLogo.png"} alt={event.title} style={{ width: "100%", borderRadius: 12, objectFit: "cover", marginTop: "10px" }} />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Box display="flex" flexDirection="column" justifyContent="center" height="100%" gap={2} mt={2}>
                                        <Box display="flex" justifyContent="center">
                                            <Typography variant="h5" fontWeight="bold" sx={{ transition: "transform 0.3s", '&:hover': { transform: "scale(1.03)" } }}>{event.title}</Typography>
                                        </Box>

                                        <Typography variant="body1" color="text.secondary">{event.summary || ""}</Typography>

                                        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                                            {(Array.isArray(event.tags) ? event.tags : event.tag ? [event.tag] : []).map((tag, idx) => (
                                                <Chip key={idx} label={tag} size="big" sx={{ fontSize: "0.7rem", height: "20px", backgroundColor: "#e3f2fd", color: "#1565c0", transition: "0.3s", '&:hover': { backgroundColor: "#bbdefb", transform: "scale(1.1)" } }} />
                                            ))}
                                        </Stack>

                                        <Box display="flex" alignItems="center" mb={1} sx={{ transition: "transform 0.3s", '&:hover': { transform: "scale(1.03)" } }}>
                                            <LocationOnIcon sx={{ mr: 1 }} />
                                            <Typography variant="body1"><strong>Location:</strong> {event.location || "TBD"}</Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" mb={2} sx={{ transition: "transform 0.3s", '&:hover': { transform: "scale(1.03)" } }}>
                                            <AccessTimeIcon sx={{ mr: 1 }} />
                                            <Typography variant="body1"><strong>Time:</strong> {new Date(event.time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</Typography>
                                        </Box>

                                        <Typography variant="body1" mb={3} sx={{ transition: "transform 0.3s", '&:hover': { transform: "scale(1.03)" } }}>{event.description || "Join us for a great event!"}</Typography>

                                        <Button variant="contained" sx={{ mt: 2, mb: 3, color: "white", fontWeight: "bold", fontSize: "1rem", transition: "transform 0.2s", '&:hover': { backgroundColor: "#333", transform: "scale(1.02)" } }} onClick={() => setShowRewards(true)}>
                                            View Earnable Rewards
                                        </Button>
                                    </Box>

                                    <Dialog open={showRewards} onClose={() => setShowRewards(false)} BackdropProps={{ sx: { backdropFilter: "blur(3px)" } }} PaperProps={{ sx: { borderRadius: 3, px: 3, py: 2, minWidth: 320 } }}>
                                        <DialogTitle fontWeight="bold">Earnable Rewards</DialogTitle>
                                        <DialogContent>
                                            <ul>
                                                {typeof event.rewards === "object" ? (
                                                    Object.entries(event.rewards).map(([cat, pts], idx) => (
                                                        <li key={idx}><strong>{cat}</strong>: {pts} pts</li>
                                                    ))
                                                ) : (
                                                    <li><strong>Reward</strong>: {event.rewards} pts</li>
                                                )}
                                            </ul>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setShowRewards(false)} variant="outlined">OK</Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            </Grid>

                            <Box mt={7}>
                                <Button fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "white", fontWeight: "bold", fontSize: "1rem", transition: "transform 0.2s", '&:hover': { backgroundColor: "#333", transform: "scale(1.02)" } }} onClick={handleAttend}>
                                    Attend
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Container>

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>{dialogMsg}</DialogTitle>
                    <DialogContent>
                        {ticketId && <Box sx={{ mt: 1 }}><strong>Ticket Number:</strong> {ticketId}</Box>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Close</Button>
                        {ticketId && (
                            <Button onClick={() => navigate("/schedule/today")} variant="contained" color="primary">View My Schedule</Button>
                        )}
                    </DialogActions>
                </Dialog>

                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>{snackbarMsg}</Alert>
                </Snackbar>
            </Box>
            <Footer />
        </Box>
    );
}

export default EventDetailPage;
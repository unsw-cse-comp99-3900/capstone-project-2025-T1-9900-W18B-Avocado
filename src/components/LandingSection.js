// src/components/Functions/LandingSection.js
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
export default function LandingSection() {
    const scrollToContent = () => {
        const anchor = document.getElementById("main-home");
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Box
            sx={{
                height: "100vh",
                background: "linear-gradient(135deg, #e0f7fa, #dcedc8)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                px: 4,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <Box display="flex" alignItems="center" justifyContent="center" mb={4} >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            mr: 2,
                            fontSize: { xs: "2rem", md: "3.5rem" },
                            lineHeight: 1.2,
                            background: "linear-gradient(90deg, #235858, black)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block",
                        }}
                    >
                        Welcome to
                    </Typography>

                    <Box
                        component="img"
                        src="/WhatsOnLogo.png"
                        alt="What's On"
                        sx={{
                            width: 400,
                            height: "auto",
                            display: "block",
                            transform: "translateY(-26px)",
                        }}
                    />
                </Box>



                <Typography variant="h6" color="text.secondary" mb={4}
                    sx={{
                        background: "linear-gradient(90deg, #a8e847, #235858)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                    View your past rewards, check the schedule for upcoming events, and explore more activities!
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        width: 200,
                        mt: 4,
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                        color: "#a8e847",
                        border: "2px solid #a8e847",
                        backgroundColor: "#000",
                        borderRadius: "30px",
                        textTransform: "none",
                        transition: "all 0.3s ease",
                        '&:hover': {
                            backgroundColor: "#1a1a1a",
                            transform: "scale(1.04)",
                            boxShadow: "0 4px 16px rgba(168, 232, 71, 0.3)",
                        },
                        '& .MuiButton-endIcon': {
                            color: "#a8e847",
                        }
                    }}
                    onClick={() => {
                        const section = document.getElementById("event-section");
                        if (section) {
                            section.scrollIntoView({ behavior: "smooth" });
                        }
                    }}
                    endIcon={<ArrowDownwardIcon />}
                >
                    Start Now
                </Button>


            </motion.div>
        </Box>
    );
}

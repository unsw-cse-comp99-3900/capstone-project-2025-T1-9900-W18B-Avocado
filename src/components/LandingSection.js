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
                <Typography variant="h3" fontWeight="bold" mb={2}>
                    Welcome to What's On!
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={4}>
                    View your past rewards, check the schedule for upcoming events, and explore more activities.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4, fontWeight: "bold", px: 4, py: 1.5 }}
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

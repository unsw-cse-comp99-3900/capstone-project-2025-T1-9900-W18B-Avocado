import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        backgroundColor: "#a8e847",
        position: "relative",
      }}
    >
      {/* Left Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, md: 6 },
          py: 8,
          gap: 3,
        }}
      >
        <img
          src="/WhatsOnLogo.png"
          alt="Logo"
          style={{ width: "400px", height: "auto" }}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.5rem",
              md: "3rem",
              lg: "3.5rem",
            },
            fontWeight: 700,
          }}
        >
          Un–Cap the Ultimate Campus Experience
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: "36rem" }}
        >
          Transforming university–student interaction for the modern age —
          retention, engagement and everything in–between!
        </Typography>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            fontSize: "44px",
            padding: "16px 40px",
            borderRadius: "10px",
            fontWeight: "bold",
            mt: 2,
            width: "fit-content",
            boxShadow: 2,
            alignSelf: "center",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Join Us
        </Button>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Top Right Buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            sx={{
              color: "#000",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              fontWeight: 1000,
              fontSize: "18px",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#eee" },
            }}
          >
            Register
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: 1000,
              fontSize: "18px",
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Log in
          </Button>
        </Box>

        <img
          src="/landing-illustration.gif"
          alt="Illustration"
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
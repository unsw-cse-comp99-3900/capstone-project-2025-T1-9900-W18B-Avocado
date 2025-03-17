import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFF66",
      }}
    >
      {/* Left Section (Logo & Join Us) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 4,
        }}
      >
        {/* Logo with Adjustable Size */}
        <img
          src="/logo.png"
          alt="What's On Logo"
          style={{
            width: "400px",
            height: "auto",
            marginBottom: "500px",
            alignSelf: "center",
            textAlign: "left",
          }}
        />

        {/* Join Us Button */}
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            position: "absolute",
            top: "50%",
            mt: 4,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: "48px",
            fontWeight: "bold",
            padding: "24px 48px",
            borderRadius: "8px",
            alignSelf: "center",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Join Us
        </Button>
      </Box>

      {/* Right Section (Event Image & Buttons) */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
        }}
      >
        {/* Event Image with Adjustable Size */}
        <img
          src="/image.png"
          alt="Event"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
          }}
        />

        {/* Register & Login Buttons */}
        <Box
            sx={{
                position: "absolute",
                top: 24,
                right: 20,
                display: "flex",
                gap: 3,
            }}
            >
            <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                width:150,
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "18px",
                padding: "8px 16px",
                borderRadius: "6px",
                "&:hover": { backgroundColor: "#ddd" },
                }}
            >
                Register
            </Button>
            <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                width: 150,
                backgroundColor: "#000",
                color: "#fff",
                fontSize: "18px",
                padding: "8px 16px",
                borderRadius: "6px",
                "&:hover": { backgroundColor: "#333" },
                }}
            >
                Log in
            </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
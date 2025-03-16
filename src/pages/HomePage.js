import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#FFFF66", // Yellow background
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
            width: "600px", // Adjust logo width
            height: "auto", // Keep aspect ratio
            marginBottom: "500px", // Moves the logo up/down
            alignSelf: "center", // Moves logo to the left
            textAlign: "left", // Aligns logo left
          }}
        />

        {/* Join Us Button */}
        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            position: "absolute",
            top: "50%", // Moves buttons further down
            mt: 4,
            backgroundColor: "#000",
            color: "#fff",
            fontSize: "48px",
            fontWeight: "bold",
            padding: "24px 48px",
            borderRadius: "8px",
            alignSelf: "center", // Moves button to the center
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
          src="/image.png" // Ensure this image is in the public/ folder
          alt="Event"
          style={{
            width: "100%", // Make it fill the container
            height: "100vh", // Make it the full height of the screen
            objectFit: "cover", // Ensure it scales properly
          }}
        />

        {/* Register & Login Buttons */}
        <Box
            sx={{
                position: "absolute",
                top: 24, // Moves buttons further down
                right: 20, // Moves buttons slightly left
                display: "flex",
                gap: 3, // Increases spacing between buttons
            }}
            >
            <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                backgroundColor: "#fff",
                color: "#000",
                fontSize: "16px", // Reduce font size
                padding: "8px 16px", // Make button smaller
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
                backgroundColor: "#000",
                color: "#fff",
                fontSize: "16px",
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
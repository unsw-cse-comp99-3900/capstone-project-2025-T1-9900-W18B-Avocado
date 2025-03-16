import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (email === "test@student.com" && password === "password123") {
        alert("Login successful!");
        navigate("/home");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#FFFF66", // Updated background color to match design
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "white", // Keep login box white for contrast
        }}
      >
        {/* Logo */}
        <img src="/logo.png" alt="App Logo" width="140" style={{ marginBottom: "16px" }} />

        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000", mb: 2 }}>
          Student Life Passport
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Log in Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#000", // Black login button
              "&:hover": { backgroundColor: "#333" }, // Slightly lighter on hover
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log in"}
          </Button>

          {/* Forgot Password Link */}
          <Box textAlign="right" mt={1}>
            <Link to="/forgot-password" style={{ textDecoration: "none", color: "#007BFF" }}>
              Forgot password?
            </Link>
          </Box>

          {/* Admin Log in Link */}
          <Box mt={2}>
            <Typography variant="body2">
              <Link to="/admin-login" style={{ textDecoration: "none", color: "#000", fontWeight: "bold" }}>
                Admin Log in
              </Link>
            </Typography>
          </Box>

          {/* Sign up Link */}
          <Box mt={2}>
            <Typography variant="body2">
              Not a member yet?{" "}
              <Link to="/register" style={{ textDecoration: "none", color: "#007BFF" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
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
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLoginPage = () => {
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
      if (email === "admin@whatson.com" && password === "admin123") {
        alert("Admin Login Successful!");
        navigate("/admin-dashboard");
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    }, 1500);
  };

  return (
    <>
    {/* 页头 */}
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button component={Link} to="/" sx={{ color: "#fff", marginRight: 2 }}>
          Home
        </Button>
        <Button component={Link} to="/login" sx={{ color: "#fff", marginRight: 2 }}>
          Login
        </Button>
        <Button component={Link} to="/register" sx={{ color: "#fff" }}>
          Register
        </Button>
      </Toolbar>
    </AppBar>
    
    <Box
      sx={{
        display: "flex",
        paddingTop: "3%",
        paddingBottom: "10%",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#FFFF66",
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
          backgroundColor: "white",
        }}
      >
        {/* Admin Logo */}
        <img src="/logo.png" alt="App Logo" width="140" style={{ marginBottom: "16px" }} />

        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000", mb: 1 }}>
          What's On! <span style={{ color: "#000" }}>| Admin</span>
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Student Life Passport - Admin Panel
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
          <TextField
            label="Admin Email"
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

          {/* Admin Login Button */}
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
              backgroundColor: "#000",
              "&:hover": { backgroundColor: "#333" },
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

          {/* Link to Student Login Page */}
          <Box mt={2}>
            <Typography variant="body2">
               I'm a student,
              <Link to="/login" style={{ textDecoration: "none", color: "#027BFF" }}>
                  Log in
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
    </>
  );
};

export default AdminLoginPage;
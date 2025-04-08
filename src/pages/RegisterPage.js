import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentID: "",
    email: "",
    name: "",
    faculty: "",
    degree: "",
    citizenship: "",
    isArcMember: "TRUE",
    graduationYear: "2025",
    role: "Student",
    password: "",
    confirmPassword: "",
    emailCode: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentMsg, setCodeSentMsg] = useState("");
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrorMsg("❌ Please enter your email first.");
      return;
    }
    if (countdown > 0) return;

    setIsSendingCode(true);
    setErrorMsg("");
    setCodeSentMsg("");

    try {
      const response = await fetch("http://localhost:5000/send-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setCodeSentMsg("✅ " + (data.message || "Verification code sent to your email."));
        setCountdown(60);
      } else {
        setErrorMsg("❌ " + (data.error || "Failed to send code."));
      }
    } catch (error) {
      setErrorMsg("❌ Network error. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.studentID ||
      !formData.email ||
      !formData.name ||
      !formData.faculty ||
      !formData.degree ||
      !formData.citizenship ||
      !formData.password ||
      !formData.role ||
      !formData.emailCode
    ) {
      setErrorMsg("❌ All fields are required, including the verification code.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("❌ Passwords do not match.");
      return;
    }
    if (!["Student", "Admin"].includes(formData.role)) {
      setErrorMsg("❌ Invalid role selected.");
      return;
    }

    try {
      let response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = await response.json();
      if (response.ok) {
        setSuccessMsg("✅ " + (data.message || "Registration successful!"));
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg("❌ " + (data.error || "An error occurred."));
      }
    } catch (error) {
      setErrorMsg("❌ Network error. Please try again.");
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button component={Link} to="/" sx={{ color: "#fff", marginRight: 2 }}>Home</Button>
          <Button component={Link} to="/login" sx={{ color: "#fff", marginRight: 2 }}>Login</Button>
          <Button component={Link} to="/register" sx={{ color: "#fff" }}>Register</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#CCFFCC", paddingTop: 4 }}>
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%", maxWidth: 900, textAlign: "center", backgroundColor: "white" }}>
          <img src="/logo.png" alt="App Logo" width="140" style={{ marginBottom: "16px" }} />

          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000", mb: 2 }}>Student Register</Typography>

          {errorMsg && <Alert severity="error" key={errorMsg}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" key={successMsg}>{successMsg}</Alert>}
          {codeSentMsg && <Alert severity="info" key={codeSentMsg}>{codeSentMsg}</Alert>}

          <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField label="Email" type="email" name="email" fullWidth value={formData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField label="Verification Code" name="emailCode" fullWidth value={formData.emailCode} onChange={handleChange} required />
              </Grid>
              <Grid item xs={6} md={4}>
                <Button variant="outlined" fullWidth onClick={handleSendCode} disabled={isSendingCode || countdown > 0} sx={{ height: "100%" }}>
                  {countdown > 0 ? `Resend in ${countdown}s` : "Send Code"}
                </Button>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Full Name" name="name" fullWidth value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Password" type="password" name="password" fullWidth value={formData.password} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Confirm Password" type="password" name="confirmPassword" fullWidth value={formData.confirmPassword} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField label="Student ID" name="studentID" fullWidth value={formData.studentID} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Faculty" name="faculty" fullWidth value={formData.faculty} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Degree" name="degree" fullWidth value={formData.degree} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Citizenship" name="citizenship" fullWidth value={formData.citizenship} onChange={handleChange} required />
              </Grid>

              <Grid item xs={12} md={6}>
                <Select fullWidth name="isArcMember" value={formData.isArcMember} onChange={handleChange}>
                  <MenuItem value="TRUE">Yes (Arc Member)</MenuItem>
                  <MenuItem value="FALSE">No</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Select fullWidth name="graduationYear" value={formData.graduationYear} onChange={handleChange}>
                  {[2023, 2024, 2025, 2026, 2027, 2028].map(year => (
                    <MenuItem key={year} value={year.toString()}>{year}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={6}>
                <Select fullWidth name="role" value={formData.role} onChange={handleChange} required>
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </Grid>
            </Grid>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontSize: "16px", fontWeight: "bold", borderRadius: "8px", backgroundColor: "#000", "&:hover": { backgroundColor: "#333" } }}>
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default RegisterPage;
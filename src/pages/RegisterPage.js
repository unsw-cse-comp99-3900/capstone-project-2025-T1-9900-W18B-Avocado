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
  Grid,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../components/CommonHeader";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
    role: "student",
    password: "",
    confirmPassword: "",
    emailCode: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeSentMsg, setCodeSentMsg] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  
    const finalData = { ...formData, role: "student" }; // 强制确保是 student
  
    if (
      !finalData.studentID ||
      !finalData.email ||
      !finalData.name ||
      !finalData.faculty ||
      !finalData.degree ||
      !finalData.citizenship ||
      !finalData.password ||
      !finalData.emailCode
    ) {
      setErrorMsg("❌ All fields are required, including the verification code.");
      return;
    }
    if (finalData.password !== finalData.confirmPassword) {
      setErrorMsg("❌ Passwords do not match.");
      return;
    }
  
    try {
      let response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData), // 👈 用的是 finalData
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#a8e847",
        }}
      >
        <CommonHeader />
        <Box sx={{ flexGrow: 1, width: "100%", display: "flex", justifyContent: "center", pt: 3, pb: 6 }}>
          <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%", maxWidth: 800, textAlign: "center", backgroundColor: "white", height: "600px", overflowY: "auto", }}>
            <img src="/WhatsOnLogo.png" alt="App Logo" width="140" style={{ marginBottom: "16px" }} />

            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000", mb: 2 }}>Student Registration</Typography>

            {errorMsg && <Alert severity="error" key={errorMsg}>{errorMsg}</Alert>}
            {successMsg && <Alert severity="success" key={successMsg}>{successMsg}</Alert>}
            {codeSentMsg && <Alert severity="info" key={codeSentMsg}>{codeSentMsg}</Alert>}

            <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField label="Email" type="email" name="email" fullWidth value={formData.email} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField label="Verification Code" name="emailCode" fullWidth value={formData.emailCode} onChange={handleChange} required />
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button variant="outlined" color="success" fullWidth onClick={handleSendCode} disabled={isSendingCode || countdown > 0} sx={{ height: "100%" }}>
                    {countdown > 0 ? `Resend in ${countdown}s` : "Send Code"}
                  </Button>
                </Grid>

                {/* Name + Student ID */}
                <Grid item xs={12} md={6}>
                  <TextField label="Full Name" name="name" fullWidth value={formData.name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Student ID" name="studentID" fullWidth value={formData.studentID} onChange={handleChange} required />
                </Grid>
                {/* Password + Password Confirm */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    fullWidth
                    value={formData.password}
                    onChange={handleChange}
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

                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField label="Faculty" name="faculty" fullWidth value={formData.faculty} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Degree" name="degree" fullWidth value={formData.degree} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField label="Citizenship" name="citizenship" fullWidth value={formData.citizenship} onChange={handleChange} required />
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel id="arc-label">Arc Member</InputLabel>
                    <Select
                      labelId="arc-label"
                      name="isArcMember"
                      value={formData.isArcMember}
                      onChange={handleChange}
                      label="Arc Member"
                    >
                      <MenuItem value="TRUE">Yes</MenuItem>
                      <MenuItem value="FALSE">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel id="grad-label">Graduation Year</InputLabel>
                    <Select
                      labelId="grad-label"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      label="Graduation Year"
                    >
                      {[2025, 2026, 2027, 2028, 2029].map(year => (
                        <MenuItem key={year} value={year.toString()}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} md={3}>
                  <FormControl fullWidth required>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      label="Role"
                    >
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}

              </Grid>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, py: 1.5, fontSize: "16px", fontWeight: "bold", borderRadius: "8px", backgroundColor: "#235858", "&:hover": { backgroundColor: "#333", color: "#a8e847" } }}>
                Register
              </Button>
            </form>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default RegisterPage;
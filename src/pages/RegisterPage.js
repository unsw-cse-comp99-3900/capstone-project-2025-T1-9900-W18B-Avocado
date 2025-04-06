import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Grid
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
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      !formData.password
    ) {
      setErrorMsg("❌ All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("❌ Passwords do not match.");
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
          justifyContent: "center",
          alignItems: "center",
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
            maxWidth: 900,
            textAlign: "center",
            backgroundColor: "white",
          }}
        >
          <img src="/logo.png" alt="App Logo" width="140" style={{ marginBottom: "16px" }} />

          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#000", mb: 2 }}>
            Student Register
          </Typography>

          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}

          <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "1rem" }}>
            <Grid container spacing={2}>
              {/* 第一行 */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* 第二行 */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Student ID"
                  name="studentID"
                  fullWidth
                  value={formData.studentID}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Faculty"
                  name="faculty"
                  fullWidth
                  value={formData.faculty}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* 第三行 */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Degree"
                  name="degree"
                  fullWidth
                  value={formData.degree}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Citizenship"
                  name="citizenship"
                  fullWidth
                  value={formData.citizenship}
                  onChange={handleChange}
                  required
                />
              </Grid>

              {/* 第四行 - 下拉框 */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="arc-member-label">Arc Member</InputLabel>
                  <Select
                    labelId="arc-member-label"
                    name="isArcMember"
                    value={formData.isArcMember}
                    onChange={handleChange}
                    label="Arc Member"
                    sx={{
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    <MenuItem value="TRUE">Yes</MenuItem>
                    <MenuItem value="FALSE">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="grad-year-label">Graduation Year</InputLabel>
                  <Select
                    labelId="grad-year-label"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    label="Graduation Year"
                    sx={{
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "16px",
                    }}
                  >
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2027">2027</MenuItem>
                    <MenuItem value="2028">2028</MenuItem>
                    <MenuItem value="2028">2029</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* 注册按钮 */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#000",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default RegisterPage;
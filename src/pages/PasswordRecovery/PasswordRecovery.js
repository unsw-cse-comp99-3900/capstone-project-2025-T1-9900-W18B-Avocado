import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

const PasswordRecovery = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [serverCode, setServerCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/validate-and-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();

      if (response.status === 200) {
        alert("✅ Verification code sent to your email.");
        setServerCode(data.code);
        setStep(2);
      } else {
        alert("❌ " + data);
      }
    } catch (err) {
      alert("❌ Network error, please try again.");
    }
  };

  const handleCodeVerification = (e) => {
    e.preventDefault();
    if (inputCode === serverCode) {
      setStep(3);
    } else {
      alert("Incorrect verification code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword }),
      });

      const data = await response.text();

      if (response.status === 200) {
        setSuccessDialogOpen(true);
      } else {
        alert("❌ " + data);
      }
    } catch (err) {
      alert("❌ Network error. Please try again.");
    }
  };

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#FFFF66",
      }}
    >
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

      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "white",
          marginTop: 10,
        }}
      >
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Password Recovery
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              We will send a verification code to your email.
            </Typography>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
            >
              Send Code →
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeVerification}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Enter the code sent to your email
            </Typography>
            <TextField
              label="Verification Code"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              required
            />
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
            >
              Verify →
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Set New Password
            </Typography>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
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
            >
              Reset →
            </Button>
          </form>
        )}
      </Paper>

      <Dialog open={successDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Password Reset Successful</DialogTitle>
        <DialogContent>
          <Typography>You can now log in with your new password!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PasswordRecovery;
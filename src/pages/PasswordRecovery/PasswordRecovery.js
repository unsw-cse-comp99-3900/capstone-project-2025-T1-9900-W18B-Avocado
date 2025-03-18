// export default PasswordRecovery;
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");

  const securityQuestion = "What is your first pet?";
  const correctAnswer = "cat";

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setRetrievedPassword("123456abc");
      setStep(3);
    } else {
      alert("Incorrect answer. Please try again.");
    }
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

      {/* 密码找回流程 */}
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
        {/* 步骤1：输入邮箱 */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Password Recovery
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please enter your email address
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
            <Button type="submit" variant="contained" fullWidth sx={{
              width: 335,
              mt: 2,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#000",
              "&:hover": { backgroundColor: "#333" },
            }}>
              Next →
            </Button>
          </form>
        )}

        {/* 步骤2：回答安全问题 */}
        {step === 2 && (
          <form onSubmit={handleSecuritySubmit}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Security Question
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Answer your security question to recover your password:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              {securityQuestion}
            </Typography>
            <TextField
              label="Answer"
              type="text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" sx={{
              width: 335,
              mt: 2,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#000",
              "&:hover": { backgroundColor: "#333" },
            }}>
              Next →
            </Button>
          </form>
        )}

        {/* 步骤3：显示恢复的密码 */}
        {step === 3 && (
          <div>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              Recovered Password
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Password recovery successful! Your password:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, color: "black" }}>
              {retrievedPassword}
            </Typography>
            <Button component={Link} to="/login" variant="contained" fullWidth sx={{
              width: 335,
              mt: 2,
              py: 1.5,
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#000",
              "&:hover": { backgroundColor: "#333" },
            }}>
              Log in →
            </Button>
          </div>
        )}
      </Paper>
    </Box>
  );
};

export default PasswordRecovery;

// import React, { useState } from "react";
// import "./PasswordRecovery.css";

// function PasswordRecovery() {
//   const [step, setStep] = useState(1); // 1: 输入邮箱，2: 安全问题，3: 显示密码
//   const [email, setEmail] = useState("");
//   const [securityAnswer, setSecurityAnswer] = useState("");
//   const [retrievedPassword, setRetrievedPassword] = useState("");
  
//   // 假设从后端获取安全问题和答案
//   const securityQuestion = "What is your first pet?"; 
//   const correctAnswer = "cat";

//   // 处理邮箱提交
//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     setStep(2);
//   };

//   // 处理安全问题提交
//   const handleSecuritySubmit = (e) => {
//     e.preventDefault();
//     if (securityAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
//       setRetrievedPassword("123456abc"); // 模拟从后端获取密码
//       setStep(3); // 跳转到密码显示页面
//     } else {
//       alert("Incorrect answer. Please try again.");
//     }
//   };

//   return (
//     <div className="password-recovery-container">
//       {step === 1 && (
//         <form onSubmit={handleEmailSubmit} className="recovery-form">
//           <h2>Password Recovery</h2>
//           <p>Please enter your Email address of your registered account</p>
//           <input 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//           />
//           <button type="submit">Next →</button>
//         </form>
//       )}

//       {step === 2 && (
//         <form onSubmit={handleSecuritySubmit} className="recovery-form">
//           <h2>Security Question</h2>
//           <p>Answer your security question to get your password</p>
//           <h3>{securityQuestion}</h3>
//           <input 
//             type="text" 
//             value={securityAnswer} 
//             onChange={(e) => setSecurityAnswer(e.target.value)} 
//             required 
//           />
//           <button type="submit">Next →</button>
//         </form>
//       )}

//       {step === 3 && (
//         <div className="recovery-form">
//           <h2>Recovered Password</h2>
//           <h3>Password recovery successful!</h3>
//           <p>Your password: <strong>{retrievedPassword}</strong></p>
//           <button>Log in →</button>
//         </div>
//       )}
//     </div>
//   );
// }

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
  const [step, setStep] = useState(1); // 1: 输入邮箱，2: 安全问题，3: 显示密码
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [retrievedPassword, setRetrievedPassword] = useState("");

  // 假设从后端获取安全问题和答案
  const securityQuestion = "What is your first pet?";
  const correctAnswer = "cat";

  // 处理邮箱提交
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // 处理安全问题提交
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setRetrievedPassword("123456abc"); // 模拟从后端获取密码
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
        backgroundColor: "#FFFF66", // 统一背景颜色
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
          marginTop: 4, // 与页头保持间距
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

import React, { useState } from "react";
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../components/CommonHeader";

import { getErrorMessage } from "../../components/Functions/getErrorMessage";
import { ErrAlert, SuccessAlert } from "../../components/AlertFormats";


const PasswordRecovery = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [serverCode, setServerCode] = useState("");
    const [prevPassword, setPrevPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/validate-and-send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            const status = response.status;

            if (response.status === 200) {
                setSnackbar({ open: true, type: "success", message: "Verification code sent to your email." });
                // get verification code and previous password from the backend
                setServerCode(data.code);
                setPrevPassword(data.password)
                setStep(2);
            } else {
                const message = getErrorMessage(status, data);
                setSnackbar({ open: true, type: "error", message });
            }
        } catch (err) {
            setSnackbar({ open: true, type: "error", message: "Network error. Please try again." });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setSnackbar({ open: true, type: "error", message: "Passwords do not match. " });
            return;
        }

        if (newPassword === prevPassword) {
            setSnackbar({ open: true, type: "error", message: "Your new password can't be the same as your previous one." });
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: inputCode, email, new_password: newPassword }),
            });

            const data = await response.text();
            const status = response.status;

            if (response.status === 200) {
                setSuccessDialogOpen(true);
            } else {
                const message = getErrorMessage(status, data);
                setSnackbar({ open: true, type: "error", message });
            }
        } catch (err) {
            setSnackbar({ open: true, type: "error", message: "Network error. Please try again." });
        }
    };

    const handleDialogClose = () => {
        setSuccessDialogOpen(false);
        navigate("/login");
    };

    const returnLogin = () => {
        navigate("/login");
    }

    return (
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

            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                    backgroundColor: "white",
                    marginTop: 6,
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
                            variant="outlined"
                            fullWidth
                            onClick={returnLogin}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                borderColor: "#000",
                                color: "#000",
                                "&:hover": { backgroundColor: "#f0f0f0", color: "#235858" },
                            }}
                        >
                            ← Back
                        </Button>
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
                                backgroundColor: "#235858",
                                "&:hover": { backgroundColor: "#000", color: "#a8e847" },
                            }}
                        >
                            Send Code →
                        </Button>
                    </form>
                )}


                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                            Reset Password
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            A verification code has been sent to your email. Please enter the code to set a new password for your account.
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
                            variant="outlined"
                            fullWidth
                            onClick={() => setStep(1)}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "8px",
                                borderColor: "#000",
                                color: "#000",
                                "&:hover": { backgroundColor: "#f0f0f0", color: "#235858" },
                            }}
                        >
                            ← Back
                        </Button>
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
                                backgroundColor: "#235858",
                                "&:hover": { backgroundColor: "#000", color: "#a8e847" },
                            }}
                        >
                            Reset →
                        </Button>
                    </form>
                )}
            </Paper>
            {snackbar.type === "error" && <ErrAlert open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />}
            {snackbar.type === "success" && <SuccessAlert open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />}

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
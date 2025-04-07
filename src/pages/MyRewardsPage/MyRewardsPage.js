import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  LinearProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom"; // ✅ 新增

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const rewardsList = [
  {
    id: 1,
    name: "Free Coffee",
    pointsRequired: 20,
    image: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
  },
  {
    id: 2,
    name: "Movie Ticket",
    pointsRequired: 50,
    image: "https://cdn-icons-png.flaticon.com/512/3103/3103446.png",
  },
  {
    id: 3,
    name: "Gift Box",
    pointsRequired: 100,
    image: "https://cdn-icons-png.flaticon.com/512/3468/3468086.png",
  },
];

const MyRewardsPage = () => {
  const [userPoints] = useState(50); // 模拟积分
  const [history, setHistory] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate(); // ✅ 新增

  const handleRedeem = (reward) => {
    if (redeemedRewards.includes(reward.id)) {
      setAlertMessage(`✅ You've already redeemed "${reward.name}".`);
    } else {
      setRedeemedRewards((prev) => [...prev, reward.id]);
      setHistory((prev) => [
        ...prev,
        `${new Date().toLocaleString()} - Redeemed "${reward.name}"`,
      ]);
      setAlertMessage(`🎉 You've successfully redeemed "${reward.name}"!`);
    }
    setAlertOpen(true);
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#DFF0D8",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingBottom: 4,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            mt: 6,
            backgroundColor: "#fff",
            borderRadius: 3,
            boxShadow: 3,
            p: 4,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            You have {userPoints} Points
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {rewardsList.map((reward) => {
              const unlocked = userPoints >= reward.pointsRequired;
              const alreadyRedeemed = redeemedRewards.includes(reward.id);
              const progress = Math.min(
                (userPoints / reward.pointsRequired) * 100,
                100
              );

              return (
                <Grid item key={reward.id}>
                  <Card
                    sx={{
                      width: 260,
                      opacity: unlocked ? 1 : 0.6,
                      border: unlocked
                        ? "2px solid #4caf50"
                        : "1px dashed #ccc",
                      transition: "0.3s",
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <img
                        src={reward.image}
                        alt={reward.name}
                        width={80}
                        height={80}
                        style={{ marginBottom: 8 }}
                      />
                      <Typography variant="h6">{reward.name}</Typography>
                      <Typography color="text.secondary">
                        Requires {reward.pointsRequired} pts
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                    </CardContent>
                    <CardActions>
                      <Tooltip
                        title={
                          alreadyRedeemed
                            ? "Already redeemed"
                            : unlocked
                            ? "Click to redeem"
                            : `Earn ${reward.pointsRequired - userPoints
                            } more points to unlock`
                        }
                      >
                        <span style={{ width: "100%" }}>
                          <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            disabled={!unlocked}
                            onClick={() => handleRedeem(reward)}
                          >
                            {alreadyRedeemed ? "Redeemed" : unlocked ? "Redeem Now" : "Locked"}
                          </Button>
                        </span>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Redemption History
            </Typography>
            {history.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No rewards redeemed yet.
              </Typography>
            ) : (
              <ul style={{ maxWidth: 500, margin: "0 auto", padding: 0 }}>
                {history.map((log, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <Typography variant="body2">{log}</Typography>
                  </li>
                ))}
              </ul>
            )}

            {/* ✅ 新增：跳转按钮 */}
            <Box textAlign="center" mt={4}>
              <Button
                variant="outlined"
                onClick={() => navigate("/reward-history")}
                sx={{
                  borderColor: "#4caf50",
                  color: "#4caf50",
                  fontWeight: "bold",
                  px: 4,
                  py: 1,
                  '&:hover': {
                    bgcolor: "#e8f5e9",
                    borderColor: "#388e3c",
                    color: "#388e3c",
                  },
                }}
              >
                View Reward History →
              </Button>
            </Box>
          </Box>
        </Container>

        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAlertOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
};

export default MyRewardsPage;

import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@mui/material";
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
  const [userPoints, setUserPoints] = useState(0);
  const [fullRecords, setFullRecords] = useState([]);
  const [redeemCountMap, setRedeemCountMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [selectedReward, setSelectedReward] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost/rewards/status", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (!res.ok) throw new Error("Server Error");
        const data = await res.json();
        setUserPoints(data.points || 0);
        const sorted = (data.records || []).sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setFullRecords(sorted);
        setRedeemCountMap(data.rewardCounts || {});
      } catch (err) {
        console.error("❌ Backend error:", err);
        const mockRecords = [
          { rewardID: 1, timestamp: "2025-04-13 15:00:00" },
          { rewardID: 2, timestamp: "2025-04-12 13:20:00" },
          { rewardID: 3, timestamp: "2025-04-11 10:15:00" },
        ];
        setUserPoints(50);
        setFullRecords(mockRecords);
        setRedeemCountMap({ 1: 3, 2: 2, 3: 1 });
        setAlertMessage("⚠️ Backend unavailable, using mock data");
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward);
    setDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    try {
      const res = await fetch("http://localhost:7000/rewards/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ rewardID: selectedReward.id }),
      });
      const data = await res.json();
      if (data.success) {
        setUserPoints(data.points);
        const now = new Date();
        const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
        setFullRecords((prev) => [
          { rewardID: selectedReward.id, timestamp },
          ...prev,
        ]);
        setRedeemCountMap((prev) => ({
          ...prev,
          [selectedReward.id]: (prev[selectedReward.id] || 0) + 1,
        }));
        setCurrentPage(1);
        setAlertMessage(`🎉 Successfully redeemed "${selectedReward.name}"!`);
      } else {
        setAlertMessage(`❌ ${data.message || "Redemption failed."}`);
      }
    } catch (err) {
      console.error("Redemption error:", err);
      setAlertMessage("❌ Redemption failed: Network or server error.");
    } finally {
      setAlertOpen(true);
      setDialogOpen(false);
      setSelectedReward(null);
    }
  };

  const displayedRecords = fullRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ backgroundColor: "#DFF0D8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ backgroundColor: "#DFF0D8", minHeight: "100vh", display: "flex", flexDirection: "column", paddingBottom: 4 }}>
        <Container maxWidth="md" sx={{ mt: 6, backgroundColor: "#fff", borderRadius: 3, boxShadow: 3, p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            You have {userPoints} Points
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {rewardsList.map((reward) => {
              const unlocked = userPoints >= reward.pointsRequired;
              const progress = Math.min((userPoints / reward.pointsRequired) * 100, 100);
              const redeemedCount = redeemCountMap[reward.id] || 0;
              return (
                <Grid item key={reward.id}>
                  <Card sx={{ width: 260, opacity: unlocked ? 1 : 0.6, border: unlocked ? "2px solid #4caf50" : "1px dashed #ccc", position: "relative" }}>
                    {redeemedCount > 0 && (
                      <Box sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "#4caf50", color: "#fff", px: 1.2, py: 0.5, borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>
                        {redeemedCount} times
                      </Box>
                    )}
                    <CardContent sx={{ textAlign: "center" }}>
                      <img src={reward.image} alt={reward.name} width={80} height={80} style={{ marginBottom: 8 }} />
                      <Typography variant="h6">{reward.name}</Typography>
                      <Typography color="text.secondary">Requires {reward.pointsRequired} pts</Typography>
                      <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, height: 8, borderRadius: 4 }} />
                    </CardContent>
                    <CardActions>
                      <Tooltip title={unlocked ? "Click to redeem" : `Earn ${reward.pointsRequired - userPoints} more points`}>
                        <span style={{ width: "100%" }}>
                          <Button variant="contained" color="success" fullWidth disabled={!unlocked} onClick={() => handleRedeemClick(reward)}>
                            Redeem Now
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
            {fullRecords.length === 0 ? (
              <Typography align="center" color="text.secondary">No rewards redeemed yet.</Typography>
            ) : (
              <>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Reward</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedRecords.map((rec, idx) => {
                      const reward = rewardsList.find((r) => r.id === rec.rewardID);
                      const name = reward ? reward.name : `Reward ${rec.rewardID}`;
                      return (
                        <TableRow key={idx}>
                          <TableCell>{rec.timestamp}</TableCell>
                          <TableCell>{name}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination count={Math.ceil(fullRecords.length / recordsPerPage)} page={currentPage} onChange={(e, value) => setCurrentPage(value)} color="primary" />
                </Box>
              </>
            )}
          </Box>
        </Container>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirm Redemption</DialogTitle>
          <DialogContent>
            {selectedReward && (
              <Typography>
                Are you sure you want to redeem <strong>{selectedReward.name}</strong> for <strong>{selectedReward.pointsRequired} points</strong>?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmRedeem} variant="contained" color="success">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert onClose={() => setAlertOpen(false)} severity="success" sx={{ width: "100%" }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </>
  );
};

export default MyRewardsPage;
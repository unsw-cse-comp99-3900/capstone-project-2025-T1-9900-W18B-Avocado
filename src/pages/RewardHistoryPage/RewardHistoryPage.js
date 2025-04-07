import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const rewards = [
  { area: "Effective Communication", points: 3 },
  { area: "Leadership & Team Management", points: 2 },
  { area: "Analytical & Problem-Solving Abilities", points: 1 },
  { area: "Professional Networking & Relationship-Building", points: 0 },
  { area: "Adaptability & Cross-Cultural Collaboration", points: 2 },
  { area: "Creative & Strategic Thinking", points: 1 },
  { area: "Project & Time Management", points: 3 },
  { area: "Emotional Intelligence & Inclusivity", points: 0 },
  { area: "Negotiation & Persuasion", points: 2 },
  { area: "Self-Motivation & Initiative", points: 1 },
];

const rowsPerPage = 5;

const RewardHistoryPage = () => {
  const totalEvents = 7;
  const totalPoints = 15;
  const [page, setPage] = useState(0);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = rewards.slice(startIndex, endIndex);

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Box className="profile-page">
        <Box display="flex" justifyContent="center" py={6} flexGrow={1}>
          <Paper
            elevation={3}
            sx={{
              width: "600px",
              borderRadius: 4,
              border: "2px solid #aed9b8",
              bgcolor: "#f7fef9",
              p: 4,
            }}
          >
            <Box textAlign="center" mb={3}>
              <Typography variant="h6">Total Events: {totalEvents}</Typography>
              <Typography variant="h6">
                Total Reward Points: {totalPoints}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
              Reward Areas Breakdown
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Areas</TableCell>
                    <TableCell>Reward Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.area}</TableCell>
                      <TableCell>{row.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" gap={2} mt={2}>
              <Button
                variant="contained"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 0}
                sx={{ backgroundColor: "#aed9b8", color: "#333" }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={endIndex >= rewards.length}
                sx={{ backgroundColor: "#aed9b8", color: "#333" }}
              >
                Next
              </Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                onClick={() => navigate("/my-rewards")}
                sx={{
                  bgcolor: "#4caf50",
                  color: "white",
                  borderRadius: 8,
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": { bgcolor: "#388e3c" },
                }}
              >
                Go to Points Redemption →
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default RewardHistoryPage;

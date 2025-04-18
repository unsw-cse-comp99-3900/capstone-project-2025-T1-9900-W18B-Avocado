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
  Collapse,
  Pagination,
  Divider,
  Stack,
  Chip,
  Grow,
  Fade,
  Zoom,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from "@mui/material";
import { motion } from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { green } from "@mui/material/colors";
import { BarChart } from "@mui/x-charts/BarChart";

// Skill Map for abbreviations
const skillMap = {
  AC: "Adaptability & Cross-Cultural Collaboration",
  AP: "Analytical & Problem-Solving Abilities",
  CT: "Creative & Strategic Thinking",
  EC: "Effective Communication",
  EI: "Emotional Intelligence & Inclusivity",
  LT: "Leadership & Team Management",
  NP: "Negotiation & Persuasion",
  PM: "Project & Time Management",
  PR: "Professional Networking & Relationship-Building",
  SM: "Self-Motivation & Initiative",
};

const events = [
  {
    name: "Hackathon 2025",
    totalPoints: 78,
    scores: {
      AC: 7, AP: 8, CT: 6, EC: 9, EI: 7, LT: 8, NP: 5, PM: 6, PR: 6, SM: 6,
    },
  },
  {
    name: "Leadership Workshop",
    totalPoints: 65,
    scores: {
      AC: 5, AP: 6, CT: 6, EC: 7, EI: 6, LT: 8, NP: 6, PM: 5, PR: 4, SM: 6,
    },
  },
  {
    name: "Innovation Bootcamp",
    totalPoints: 81,
    scores: {
      AC: 8, AP: 9, CT: 8, EC: 8, EI: 7, LT: 7, NP: 7, PM: 8, PR: 9, SM: 7,
    },
  },
];

const eventsPerPage = 10;

const RewardHistoryPage = () => {
  const totalEvents = events.length;
  const totalPoints = events.reduce((sum, e) => sum + e.totalPoints, 0);

  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (page - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentRows = events.slice(startIndex, endIndex);

  const handleToggleRow = (eventName) => {
    setExpandedRow((prev) => (prev === eventName ? null : eventName));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setExpandedRow(null);
  };

  const renderChart = (event) => {
    const dataset = Object.entries(event.scores).map(([code, score]) => ({
      skill: code, // Display abbreviation in the chart
      score,
    }));

    return (
      <BarChart
        dataset={dataset}
        yAxis={[{ scaleType: "band", dataKey: "skill" }]}
        xAxis={[
          {
            min: 0,
            max: 10,
            tickMinStep: 1,
            ticks: Array.from({ length: 11 }, (_, i) => i),
          },
        ]}
        series={[
          {
            dataKey: "score",
            label: "Score",
            color: green[500],
            valueFormatter: (v) => `${v}/10`,
            valueDomain: [0, 10],
            showMark: true,
          },
        ]}
        layout="horizontal"
        height={300}
        margin={{ left: 80 }}
        grid={{ horizontal: true }}
        legend={{ hidden: false }}
      />
    );
  };

  return (
    <>
      <Header />
      <Box bgcolor="#f0f4f7" minHeight="100vh">
        <Box display="flex" justifyContent="center" py={6}>
          <Paper
            elevation={4}
            sx={{
              width: "960px",
              borderRadius: 4,
              bgcolor: "#ffffff",
              p: 5,
            }}
          >
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue'",
                  background: "linear-gradient(90deg, #388e3c, #66bb6a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                🎯 My Skill Development History
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Track your skill growth across events
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Stack direction="row" spacing={4} justifyContent="center">
                <Grow in>
                  <Chip
                    label={`Total Events: ${totalEvents}`}
                    color="success"
                    sx={{ fontWeight: "bold", fontSize: "0.875rem", px: 1.5 }}
                  />
                </Grow>
                <Grow in timeout={500}>
                  <Chip
                    label={`Total Points: ${totalPoints}`}
                    color="primary"
                    sx={{ fontWeight: "bold", fontSize: "0.875rem", px: 1.5 }}
                  />
                </Grow>
              </Stack>
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{
                fontFamily: "'Roboto Slab', 'Georgia', serif",
                borderLeft: "4px solid #43a047",
                pl: 2,
                color: "#2e7d32",
              }}
            >
              🧩 Event Reward Breakdown
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#f1f5f2" }}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Event Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Total Points
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        Details
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((row, index) => (
                    <React.Fragment key={index}>
                      <TableRow hover sx={{ transition: 'all 0.3s ease' }}>
                        <TableCell>
                          <Typography variant="body2">{row.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Zoom in>
                            <Chip
                              label={`${row.totalPoints}`}
                              sx={{
                                backgroundColor: green[100],
                                color: green[800],
                                fontWeight: "bold",
                                fontSize: "0.85rem",
                              }}
                            />
                          </Zoom>
                        </TableCell>
                        <TableCell align="right">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleToggleRow(row.name)}
                              sx={{ fontWeight: "bold" }}
                            >
                              {expandedRow === row.name ? "Hide" : "View"}
                            </Button>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} sx={{ p: 0, bgcolor: "#fafafa" }}>
                          <Collapse in={expandedRow === row.name} timeout="auto" unmountOnExit>
                            <Fade in={expandedRow === row.name}>
                              <Box p={2}>{renderChart(row)}</Box>
                            </Fade>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Button Below Event Breakdown */}
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
            </Box>

            {/* Skill Abbreviations Legend Below Pagination */}
            <Box mt={3}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
              Skill Description:
              </Typography>
              <List>
                {Object.entries(skillMap).map(([abbreviation, fullName]) => (
                  <ListItem key={abbreviation}>
                    <ListItemText primary={`${abbreviation}: ${fullName}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default RewardHistoryPage;

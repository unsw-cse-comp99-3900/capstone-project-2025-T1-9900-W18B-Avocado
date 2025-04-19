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
  Stack,
  Chip,
  Grow,
  Fade,
  Zoom,
  Divider
} from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion } from "framer-motion";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { BarChart } from "@mui/x-charts/BarChart";
import "./RewardHistoryPage.css";
import skillMap from "../../components/Functions/skillMap";


const events = [
  {
    name: "Hackathon 2025",
    totalPoints: 6,
    scores: { AC: 0, AP: 3, CT: 0, EC: 1, EI: 0, LT: 2, NP: 0, PM: 0, PR: 0, SM: 0 },
  },
  {
    name: "Leadership Workshop",
    totalPoints: 65,
    scores: { AC: 5, AP: 6, CT: 6, EC: 7, EI: 6, LT: 8, NP: 6, PM: 5, PR: 4, SM: 6 },
  },
  {
    name: "Innovation Bootcamp",
    totalPoints: 81,
    scores: { AC: 8, AP: 9, CT: 8, EC: 8, EI: 7, LT: 7, NP: 7, PM: 8, PR: 9, SM: 7 },
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
      skill: code,
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
      <Box className="reward-wrapper">
        <Box display="flex" justifyContent="center">
          <Box elevation={4} className="reward-container">
            <Box textAlign="center" mb={4}>
              <Box display="flex" justifyContent="center">
                <AutoAwesomeIcon />
                <Typography className="reward-title" sx={{
                  fontSize: {
                    xs: '1.8rem',
                    sm: '2.2rem',
                    md: '2.8rem',
                    lg: '3rem',
                  },
                }}>
                  My Skill Development History
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                className="reward-subtitle"
                sx={{
                  fontSize: {
                    xs: '0.9rem',
                    sm: '1rem',
                    md: '1.1rem',
                  },
                  color: 'text.secondary',
                }}
              >
                Track your skill growth across events
              </Typography>

              <Stack direction="row" spacing={4} justifyContent="center" mt={2}>
                <Grow in>
                  <Typography variant="h6" color="#235858" fontWeight="bold">
                    Total Events: {totalEvents}
                  </Typography>
                </Grow>
                <Grow in timeout={500}>
                  <Typography variant="h6" color="#235858" fontWeight="bold">
                    Total Points: {totalPoints}
                  </Typography>
                </Grow>
              </Stack>

            </Box>

            <Typography variant="h6" className="reward-section-title">
              Event Reward Breakdown
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead className="reward-table-head">
                  <TableRow>
                    <TableCell ><strong>Event Name</strong></TableCell>
                    <TableCell ><strong>Total Points</strong></TableCell>
                    <TableCell align="right" sx={{ pr: 3.5 }}><strong>Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((row, index) => (
                    <React.Fragment key={index}>
                      <TableRow hover>
                        <TableCell>{row.name}</TableCell>
                        <TableCell sx={{ pl: 3.2 }}>
                          <Zoom in>
                            <Chip label={row.totalPoints} className="reward-chip-score" />
                          </Zoom>
                        </TableCell>
                        <TableCell align="right">
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              color="success"
                              onClick={() => handleToggleRow(row.name)}
                            >
                              {expandedRow === row.name ? "Hide" : "View"}
                            </Button>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="reward-collapse-cell">
                          <Collapse in={expandedRow === row.name} timeout="auto" unmountOnExit>
                            <Fade in={expandedRow === row.name}>
                              <Box className="reward-collapse-content">{renderChart(row)}</Box>
                            </Fade>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={4} mb={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="success"
                variant="outlined"
              />
            </Box>
            <Divider />

            <Box className="reward-skill-legend">
              <Typography variant="h6" className="reward-section-title" gutterBottom>
                Skill Description
              </Typography>
              <TableContainer className="skill-table-container">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className="skill-header" align="center">Abbreviation</TableCell>
                      <TableCell className="skill-header" align="center">Full Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(skillMap).map(([abbr, full]) => (
                      <TableRow key={abbr}>
                        <TableCell align="center" >{abbr}</TableCell>
                        <TableCell align="center" >{full}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default RewardHistoryPage;
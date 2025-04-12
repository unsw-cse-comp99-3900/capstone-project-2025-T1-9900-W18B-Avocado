import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./SchedulePage.css";

// 格式化日期
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Australia/Sydney",
  }).format(date);
}

// 显示签到状态
function getEventStatusLabel(event) {
  return event.checkIn === 1 ? (
    <Chip label="Checked In" color="success" size="small" variant="outlined" />
  ) : (
    <Chip label="Not Checked In" color="default" size="small" variant="outlined" />
  );
}

function SchedulePage() {
  const location = useLocation();
  const [category, setCategory] = useState("current");
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:7000/my_event?filter=${category}&page=${page}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setEventList(data.events || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes("upcoming")) setCategory("upcoming");
    else if (pathname.includes("previous")) setCategory("previous");
    else setCategory("current");
    setPage(1);
  }, [location]);

  useEffect(() => {
    fetchEvents();
  }, [category, page]);

  const handleCheckIn = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/checkin/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
  
      if (response.status === 200) {
        setEventList((prev) =>
          prev.map((e) => (e.eventID === id ? { ...e, checkIn: 1 } : e))
        );
      } else {
        console.error("❌ Check-in failed with status:", response.status);
        alert("Check-in failed");
      }
    } catch (err) {
      console.error("❌ Network or server error during check-in:", err);
      alert("Check-in failed: Network error");
    }
  };

  return (
    <div>
      <Header />
      <div className="schedule-container">
        {/* 分类标签导航 */}
        <div className="tabs">
          <Link to="/schedule/current" className={location.pathname === "/schedule/current" ? "active" : ""}>
            Current Events
          </Link>
          <Link to="/schedule/upcoming" className={location.pathname === "/schedule/upcoming" ? "active" : ""}>
            Upcoming Events
          </Link>
          <Link to="/schedule/previous" className={location.pathname === "/schedule/previous" ? "active" : ""}>
            Previous Events
          </Link>
        </div>

        {/* 表格内容区域 */}
        <Box p={2} width="100%">
          <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
            <Box mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Events List
              </Typography>
            </Box>

            <Table size="small">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Event Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>End Time</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tag</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && eventList.map((event) => (
                  <TableRow key={event.eventID} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                    <TableCell>{event.eventID}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{formatDate(event.startTime)}</TableCell>
                    <TableCell>{formatDate(event.endTime)}</TableCell>
                    <TableCell>
                      <Chip label={event.tag} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      {category === "current" && event.checkIn === 0 ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => handleCheckIn(event.eventID)}
                        >
                          Check In
                        </Button>
                      ) : (
                        getEventStatusLabel(event)
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit"><IconButton size="small"><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error"><DeleteIcon /></IconButton></Tooltip>
                      <Tooltip title="Preview"><IconButton size="small"><VisibilityIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {loading && <Typography mt={2}>Loading...</Typography>}

            {/* 分页器 */}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </Paper>
        </Box>
      </div>
      <Footer />
    </div>
  );
}

export default SchedulePage;

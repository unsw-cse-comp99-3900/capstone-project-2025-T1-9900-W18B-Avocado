import React, { useState } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./SchedulePage.css";

// Mock events data
const eventsData = {
  current: [
    { id: 1, name: "Cultural Mixer", start: "2025-02-28 22:00:00", end: "2025-03-01 03:00:00", location: "Science Theatre", checkedIn: false },
    { id: 2, name: "AI Workshop", start: "2025-02-28 18:00:00", end: "2025-02-28 21:00:00", location: "Kensington Hall", checkedIn: true },
  ],
  upcoming: [
    { id: 3, name: "Wellness Retreat", start: "2025-03-02 22:00:00", end: "2025-03-03 03:00:00", location: "Wellness Room", checkedIn: false },
    { id: 4, name: "Art & Craft Workshop", start: "2025-03-01 22:00:00", end: "2025-03-02 03:00:00", location: "Art Studio", checkedIn: false },
  ],
  previous: [
    { id: 5, name: "Startup Pitch Fest", start: "2025-02-28 12:00:00", end: "2025-02-28 14:00:00", checkedIn: true },
  ],
};

// 格式化时间显示
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

// 获取状态标签
function getEventStatusLabel(event) {
  return event.checkedIn ? (
    <Chip label="Checked In" color="success" size="small" variant="outlined" />
  ) : (
    <Chip label="Not Checked In" color="default" size="small" variant="outlined" />
  );
}

// 表格组件
function EventListTable({ events, category }) {
  const [eventList, setEventList] = useState(events);

  const handleCheckIn = (id) => {
    const updated = eventList.map((e) =>
      e.id === id ? { ...e, checkedIn: true } : e
    );
    setEventList(updated);
  };

  return (
    <Box p={2}>
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
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventList.map((event) => (
              <TableRow key={event.id} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                <TableCell>{event.id}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{formatDate(event.start)}</TableCell>
                <TableCell>{formatDate(event.end)}</TableCell>
                <TableCell>
                  {category === "current" && !event.checkedIn ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleCheckIn(event.id)}
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
      </Paper>
    </Box>
  );
}

// 主页面
function SchedulePage() {
  const location = useLocation();

  return (
    <div>
      <Header />
      <div className="schedule-container">
        {/* 左侧 Tabs */}
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

        {/* 右侧内容区域 */}
        <Routes>
          <Route path="current" element={<EventListTable events={eventsData.current} category="current" />} />
          <Route path="upcoming" element={<EventListTable events={eventsData.upcoming} category="upcoming" />} />
          <Route path="previous" element={<EventListTable events={eventsData.previous} category="previous" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default SchedulePage;

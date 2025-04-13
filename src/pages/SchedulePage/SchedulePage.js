import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./SchedulePage.css";

// 格式化日期函数
function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return "Invalid Date";
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

// 签到状态显示
function getEventStatusLabel(event) {
  return event.checkIn === 1 ? (
    <Chip label="Checked In" color="success" size="small" variant="outlined" />
  ) : (
    <Chip label="Not Checked In" color="default" size="small" variant="outlined" />
  );
}

function SchedulePage() {
  const location = useLocation();

  // 根据初始 location.pathname 计算初始 filter 值
  const initialCategory = location.pathname.includes("upcoming")
    ? "upcoming"
    : location.pathname.includes("previous")
    ? "previous"
    : "current";
  const [category, setCategory] = useState(initialCategory);
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [selectedEventID, setSelectedEventID] = useState(null);

  // 自定义弹窗的样式（用于确认签到的自定义弹窗）
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1300,
  };

  const modalStyle = {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "400px",
    textAlign: "center",
  };

  // 当路由(location)变化时，更新 filter 与页码
  useEffect(() => {
    const pathname = location.pathname;
    const newCategory = pathname.includes("upcoming")
      ? "upcoming"
      : pathname.includes("previous")
      ? "previous"
      : "current";
    setCategory(newCategory);
    setPage(1);
  }, [location]);

  // 根据 category 与 page 加载活动数据
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:7000/my_event?filter=${category}&page=${page}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (!res.ok) throw new Error("Server Error");
        const data = await res.json();
        setEventList(data.events || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        // 如无后端则使用死数据进行测试（共 10 条数据）
        const dummyData = Array.from({ length: 10 }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          return {
            eventID: 1000 + i,
            name: `Mock Event ${i + 1}`,
            startTime: `2025-04-${day}T14:00:00`,
            endTime: `2025-04-${day}T16:00:00`,
            tag: "Test",
            checkIn: i % 2, // 模拟交替签到状态
          };
        });
        setEventList(dummyData);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [category, page]);

  // 调用签到接口（若后端不可用可自行模拟）
  const handleCheckIn = async (id) => {
    try {
      const res = await fetch(`http://localhost:7000/checkin/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200) {
        setEventList((prev) =>
          prev.map((e) => (e.eventID === id ? { ...e, checkIn: 1 } : e))
        );
      } else {
        alert("Check-in failed with status: " + res.status);
      }
    } catch (err) {
      alert("Check-in failed due to network/server error.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            backgroundColor: "#DFF0D8",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="schedule-container">
        {/* 分类标签导航 */}
        <div className="tabs">
          <Link
            to="/schedule/current"
            className={location.pathname === "/schedule/current" ? "active" : ""}
          >
            Current Events
          </Link>
          <Link
            to="/schedule/upcoming"
            className={location.pathname === "/schedule/upcoming" ? "active" : ""}
          >
            Upcoming Events
          </Link>
          <Link
            to="/schedule/previous"
            className={location.pathname === "/schedule/previous" ? "active" : ""}
          >
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
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eventList.map((event) => (
                  <TableRow
                    key={event.eventID}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    }}
                  >
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
                          onClick={() => {
                            setSelectedEventID(event.eventID);
                            setCheckInDialogOpen(true);
                          }}
                        >
                          Check In
                        </Button>
                      ) : (
                        getEventStatusLabel(event)
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Preview">
                        <IconButton size="small">
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {loading && <Typography mt={2}>Loading...</Typography>}

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

      {/* 自定义确认签到弹窗 */}
      {checkInDialogOpen && (
        <Box style={overlayStyle}>
          <Box style={modalStyle}>
            <Typography variant="h6" gutterBottom>
              Confirm Check-In
            </Typography>
            <Typography>Are you sure you want to check in for this event?</Typography>
            <Box mt={3} display="flex" justifyContent="space-around">
              <Button variant="outlined" onClick={() => setCheckInDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleCheckIn(selectedEventID);
                  setCheckInDialogOpen(false);
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default SchedulePage;

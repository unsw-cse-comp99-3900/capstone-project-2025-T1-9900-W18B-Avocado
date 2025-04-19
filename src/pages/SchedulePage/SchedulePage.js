import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Box,
  Typography,
  Chip,
  Paper,
  Button,
  Pagination,
  Divider,
  CircularProgress,
} from "@mui/material";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./SchedulePage.css";
import FixedCell from "../../components/Admin/FixedCell";
import HorizontalScrollBox from "../../components/Admin/Styles/HorizontalScrollBox";

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

const chipStyle = {
  // width: 118,
  fontWeight: 600,
  height: 32,
  fontSize: "0.8125rem",
  borderRadius: "10px",
  px: 1.5,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)"
};


function getEventStatusLabel(event) {
  return event.checkIn === 0 ? (
    <Chip label="Unchecked" color="warning" sx={chipStyle} variant="contained" />
  ) : (
    <Chip label="Completed" color="default" sx={chipStyle} variant="contained" />
  );
}

function SchedulePage() {
  const location = useLocation();
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
    padding: "16px",
  };

  const modalStyle = {
    position: "relative",
    backgroundColor: "#fff",
    padding: "32px 24px 24px",
    borderRadius: "12px",
    maxWidth: "500px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };


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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:7000/past_event?filter=${category}&page=${page}`,
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
        const dummyData = Array.from({ length: 10 }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          return {
            eventID: 1000 + i,
            name: `Mock Event ${i + 1}`,
            startTime: `2025-04-${day}T14:00:00`,
            endTime: `2025-04-${day}T16:00:00`,
            tag: "Test",
            checkIn: i % 2,
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
        <div className="schedule-tabs">
          <Link
            to="/schedule/current"
            className={location.pathname === "/schedule/current" ? "schedule-active" : ""}
          >
            Current Events
          </Link>
          <Link
            to="/schedule/upcoming"
            className={location.pathname === "/schedule/upcoming" ? "schedule-active" : ""}
          >
            Upcoming Events
          </Link>
          <Link
            to="/schedule/previous"
            className={location.pathname === "/schedule/previous" ? "schedule-active" : ""}
          >
            Previous Events
          </Link>
        </div>
        <div className="schedule-content-wrapper">

        <Box sx={{width:"97%", m:2}}>
          <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
            <Box mb={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Typography sx={{ px: 1, py: 0.5 }} variant="h5" fontWeight="bold">Event List</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <HorizontalScrollBox>
              <Table size="small" sx={{ minWidth: "960px", width: "100%" }}>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <FixedCell width="11%" minWidth={100} fontWeight="bold">Ticket ID</FixedCell>
                    <FixedCell width="27%" minWidth={260} fontWeight="bold">Event Name</FixedCell>
                    <FixedCell width="17%" minWidth={160} fontWeight="bold">Start Time</FixedCell>
                    <FixedCell width="17%" minWidth={160} fontWeight="bold">End Time</FixedCell>
                    <FixedCell width="14%" minWidth={140} fontWeight="bold">Tag</FixedCell>
                    <FixedCell width="14%" minWidth={140} fontWeight="bold">Status</FixedCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventList.map((event) => (
                    <TableRow key={event.eventID} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                      <FixedCell width="11%" minWidth={100}>{event.ticketID}</FixedCell>
                      <FixedCell width="27%" minWidth={260}>{event.name}</FixedCell>
                      <FixedCell width="17%" minWidth={160}>{formatDate(event.startTime)}</FixedCell>
                      <FixedCell width="17%" minWidth={160}>{formatDate(event.endTime)}</FixedCell>
                      <FixedCell width="14%" minWidth={140}>
                        <Chip label={event.tag} variant="outlined" />
                      </FixedCell>
                      <FixedCell width="14%" minWidth={140}>
                        {category === "current" && event.checkIn === 0 ? (
                          <Button
                            sx={{ width: "118px" }}
                            size="small"
                            variant="contained"
                            color="success"
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
                      </FixedCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </HorizontalScrollBox>

            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="success"
                variant="outlined"
              />
            </Box>
          </Paper>
        </Box>
        </div>

      </div>
      <Footer />

      {checkInDialogOpen && (
        <Box style={overlayStyle}>
          <Box style={modalStyle}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h5" fontWeight="bold">
                Confirm Check-In
              </Typography>
            </Box>
            <Typography variant="h6">Are you sure you want to check in for this event?</Typography>
            <Box mt={3} display="flex" justifyContent="space-around">
              <Button color="error" onClick={() => setCheckInDialogOpen(false)}>
                Cancel
              </Button>
              <Button
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
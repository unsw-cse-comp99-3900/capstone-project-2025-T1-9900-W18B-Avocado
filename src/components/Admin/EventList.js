import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TextField,
  Pagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FixedCell from "./FixedCell";
import DeleteEventDialog from "./Dialogs/DeleteEventDialog";
import EditEventDialog from "./Dialogs/EditEventDialog";

const mockData = {
  events: [
    {
      AC: 1,
      AP: 0,
      CT: 0,
      EC: 0,
      EI: 0,
      LT: 2,
      NP: 0,
      PM: 4,
      PR: 0,
      SM: 0,
      description: "3",
      endTime: "2025-04-10 22:45:00",
      eventID: 3,
      externalLink: "3",
      image: "/static/uploads/00ffc8b8219a45c5a412023d24809408.png",
      location: "Lower Campus",
      name: "Food Festival",
      organizer: "Arc",
      startTime: "2025-04-08 22:45:00",
      summary: "Enjoy live performance",
      tag: 1,
    },
    {
      AC: 1,
      AP: 0,
      CT: 0,
      EC: 0,
      EI: 0,
      LT: 2,
      NP: 0,
      PM: 4,
      PR: 0,
      SM: 0,
      description: "3",
      endTime: "2025-05-01 22:45:00",
      eventID: 2,
      externalLink: "3",
      image: "/static/uploads/00ffc8b8219a45c5a412023d24809408.png",
      location: "Music Theatre",
      name: "Live Band Concert ",
      organizer: "Music Club",
      startTime: "2025-04-30 22:45:00",
      summary: "Enjoy live performance",
      tag: 1,
    },
    {
      AC: 0,
      AP: 3,
      CT: 0,
      EC: 0,
      EI: 3,
      LT: 0,
      NP: 0,
      PM: 1,
      PR: 1,
      SM: 0,
      description: "1",
      endTime: "2025-04-06 20:33:00",
      eventID: 1,
      externalLink: null,
      image: null,
      location: "Hysen Playground",
      name: "Go Rumbling",
      organizer: "Arc",
      startTime: "2025-03-31 20:33:00",
      summary: "Create a better world",
      tag: "1",
    },
  ],
  page: 1,
  pageSize: 10,
  totalCount: 100,
  totalPages: 10,
};

const statusInfoMap = {
  current: { label: "Current", color: "success" },
  upcoming: { label: "Upcoming", color: "info" },
  previous: { label: "Previous", color: "default" },
};

function getEventStatus(start, end) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return { label: "Upcoming", color: "info" };
  else if (now >= startDate && now <= endDate) return { label: "Current", color: "success" };
  else return { label: "Previous", color: "default" };
}

function formatDate(dateStr) {
  if (!dateStr) return "Invalid Date";
  const fixedStr = dateStr.replace(" ", "T");
  const date = new Date(fixedStr);
  if (isNaN(date)) return "Invalid Date";
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

const processEvent = (e, filterStatus) => {
  const status = filterStatus === "All" ? getEventStatus(e.startTime, e.endTime) : statusInfoMap[filterStatus.toLowerCase()];
  return { ...e, status };
};

function EventListTable({ isStatic = false }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      let eventList = [];
      if (isStatic) {
        eventList = mockData.events;
        const filteredEvents = eventList.filter((e) =>
          e.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const processed = filteredEvents.map((e) => processEvent(e, filterStatus));
        setEvents(processed);
        setTotalCount(mockData.totalCount || filteredEvents.length);
      } else {
        const filterType = filterStatus.toLowerCase();
        const response = await fetch(
          `http://localhost:7000/event_list?filter=${filterType}&page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
        );
        if (!response.ok) {
          const data = await response.json();
          setErrorMsg(data.error || `❌ Error ${response.status}: Failed to fetch events.`);
          setEvents([]);
          setTotalCount(0);
          return;
        }
        const data = await response.json();
        const processed = data.events.map((e) => processEvent(e, filterStatus));
        setEvents(processed);
        setTotalCount(data.totalCount || data.events.length);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents([]);
      setTotalCount(0);
      setErrorMsg("❌ Network error: Unable to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
    setErrorMsg("");
  }, [filterStatus, page, isStatic, searchTerm]);
  
  // delete event
  const handleDeleteConfirm = async () => {
    if (!selectedEvent?.eventID) return;
  
    try {
      const response = await fetch(
        `http://localhost:7000/admin/delete_event/${selectedEvent.eventID}`,
        {
          method: "DELETE",
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to delete event:", errorData);
      } else {
        console.log("✅ Event deleted:", selectedEvent.eventID);
        await fetchEvents();
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
  };  

  // edit event
  const handleEditConfirm = async (editedEvent) => {
    if (!editedEvent?.eventID) return;
  
    try {
      const formData = new FormData();
  
      for (const key in editedEvent) {
        if (key === "image") {
          formData.append("image", editedEvent.image);
        } else if (key === "status") {
          continue;
        } else {
          formData.append(key, editedEvent[key]);
        }
      }      
  
      const response = await fetch("http://localhost:7000/admin/update_event", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to update event:", errorData);
      } else {
        console.log("✅ Event updated:", editedEvent.eventID);
        await fetchEvents();
      }
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };
  

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2, overflowX: "auto" }}>
        {/* Header controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
          <Typography variant="h6" fontWeight="bold">
            Manage Events
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Event Name"
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Current">Current</MenuItem>
                <MenuItem value="Previous">Previous</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Error display */}
        {errorMsg && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        {/* Table */}
          <Table size="small" sx={{ width: "1020px" }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <FixedCell width={100} fontWeight="bold">Event ID</FixedCell>
                <FixedCell width={250} fontWeight="bold">Event Name</FixedCell>
                <FixedCell width={200} fontWeight="bold">Start Time</FixedCell>
                <FixedCell width={200} fontWeight="bold">End Time</FixedCell>
                <FixedCell width={120} fontWeight="bold">Event Status</FixedCell>
                <FixedCell width={150} fontWeight="bold" align="center">Actions</FixedCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.eventID} hover sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                  <FixedCell width={100}>{event.eventID}</FixedCell>
                  <FixedCell width={250}>{event.name}</FixedCell>
                  <FixedCell width={200}>{formatDate(event.startTime)}</FixedCell>
                  <FixedCell width={200}>{formatDate(event.endTime)}</FixedCell>
                  <FixedCell width={120}>
                    <Chip
                      label={event.status.label}
                      color={event.status.color}
                      size="small"
                      variant="outlined"
                    />
                  </FixedCell>
                  <FixedCell width={150} align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => {
                        setSelectedEvent(event);
                        setEditDialogOpen(true);
                      }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedEvent(event);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </FixedCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Paper>

      {/* Dialogs */}
      <DeleteEventDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        event={selectedEvent}
      />
      <EditEventDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={handleEditConfirm}
        event={selectedEvent}
      />
    </Box>
  );
}

export default EventListTable;
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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FixedCell from "./FixedCell";
import DeleteEventDialog from "./Dialogs/DeleteEventDialog";
import EditEventDialog from "./Dialogs/EditEventDialog";

const mockData = {
  "events": [
    {
      "AC": 1,
      "AP": 0,
      "CT": 0,
      "EC": 0,
      "EI": 0,
      "LT": 2,
      "NP": 0,
      "PM": 4,
      "PR": 0,
      "SM": 0,
      "description": "3",
      "endTime": "2025-04-03 22:45:00",
      "eventID": 2,
      "externalLink": "3",
      "image": "/static/uploads/00ffc8b8219a45c5a412023d24809408.png",
      "location": "3",
      "name": "3",
      "organizer": "3",
      "startTime": "2025-04-03 22:45:00",
      "summary": "3",
      "tag": 1
    },
    {
      "AC": 0,
      "AP": 3,
      "CT": 0,
      "EC": 0,
      "EI": 3,
      "LT": 0,
      "NP": 0,
      "PM": 1,
      "PR": 1,
      "SM": 0,
      "description": "1",
      "endTime": "2025-04-06 20:33:00",
      "eventID": 1,
      "externalLink": null,
      "image": null,
      "location": "1",
      "name": "1",
      "organizer": "1",
      "startTime": "2025-03-31 20:33:00",
      "summary": "1",
      "tag": "1"
    }
  ],
  "page": 1,
  "pageSize": 10
};

// status labels
const statusInfoMap = {
  current: { label: "Current", color: "success" },
  upcoming: { label: "Upcoming", color: "info" },
  previous: { label: "Previous", color: "default" },
};

// catagory status labels
function getEventStatus(start, end) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return { label: "Upcoming", color: "info" };
  else if (now >= startDate && now <= endDate) return { label: "Current", color: "success" };
  else return { label: "Previous", color: "default" };
}

// format time
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
  const status = filterStatus === "All"
    ? getEventStatus(e.startTime, e.endTime)
    : statusInfoMap[filterStatus.toLowerCase()];

  return {
    eventID: e.eventID,
    name: e.name,
    startTime: e.startTime,
    endTime: e.endTime,
    location: e.location,
    organizer: e.organizer,
    summary: e.summary,
    description: e.description,
    tag: e.tag,
    externalLink: e.externalLink,
    image: e.image,

    // Skill points
    AC: e.AC,
    AP: e.AP,
    CT: e.CT,
    EC: e.EC,
    EI: e.EI,
    LT: e.LT,
    NP: e.NP,
    PM: e.PM,
    PR: e.PR,
    SM: e.SM,
    status
  };
};

function EventListTable({ isStatic = false }) {
  const [filterStatus, setFilterStatus] = useState("All");
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
      } else {
        const filterType = filterStatus.toLowerCase();
        const response = await fetch(
          `http://localhost:7000/event_list?filter=${filterType}&page=${page + 1}&limit=${rowsPerPage}`
        );

        if (!response.ok) {
          const data = await response.json();
          setErrorMsg(data.error || `❌ Error ${response.status}: Failed to fetch events.`);
          setEvents([]);
          setTotalCount(0);
          return;
        }

        const data = await response.json();
        eventList = data.events;
      }

      const processed = eventList.map((e) => processEvent(e, filterStatus));
      setEvents(processed);
      setTotalCount(eventList.length);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setEvents([]);
      setTotalCount(0);
      setErrorMsg("❌ Network error: Unable to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filterStatus, page, isStatic]);


  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // delete event
  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent?.eventID) return;

    try {
      const response = await fetch("http://localhost:7000/admin/delete-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventID: selectedEvent.eventID }),
      });

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
  const handleEditClick = (event) => {
    setSelectedEvent(event);
    console.log(event);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEditConfirm = async () => {
    if (!selectedEvent?.eventID) return;
  
    try {
      const response = await fetch("http://localhost:7000/admin/update-event", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedEvent),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to update event:", errorData);
      } else {
        console.log("✅ Event updated:", selectedEvent.eventID);
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
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Manage Events</Typography>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={handleFilterChange}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Current">Current</MenuItem>
              <MenuItem value="Previous">Previous</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {errorMsg && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        <Table size="small">
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
                  <Chip label={event.status.label} color={event.status.color} size="small" variant="outlined" />
                </FixedCell>
                <FixedCell width={150} align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(event)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(event)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Preview"><IconButton size="small"><VisibilityIcon /></IconButton></Tooltip>
                </FixedCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Paper>
      <DeleteEventDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        event={selectedEvent}
      />
      <EditEventDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        onConfirm={handleEditConfirm}
        event={selectedEvent}
      />
    </Box>
  );
}

export default EventListTable;

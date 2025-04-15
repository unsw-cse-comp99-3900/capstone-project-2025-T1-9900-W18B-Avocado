import React, { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Chip,
  Box,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Modal,
  Card,
  CardContent,
  CardMedia,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const TAGS = [
  "Wellness", "Networking", "Games", "Startups", "Technology", "Entrepreneurship",
  "Careers", "Sustainability", "Tech", "Books", "Art", "Coding", "Debate",
  "Movies", "Music", "Social", "Cultural", "Foods", "Volunteering"
];

const useMock = false; // Add flag for using mock data

export default function SearchPopup({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0); // Added totalCount state

  const inputRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim() && selectedTags.size === 0) return;

    setLoading(true);
    setError(null);

    try {
      let newEvents = [];

      if (useMock) {
        // Use mock data if flag is true
        const response = await axios.get("/mock_events.json");
        const mockEvents = response.data.events || [];
        newEvents = mockEvents.filter(event => 
          event.name.toLowerCase().includes(query.toLowerCase()) &&
          (selectedTags.size === 0 || Array.from(selectedTags).some(tag => event.tags.includes(tag)))
        );
        setTotalCount(newEvents.length); // Update totalCount for mock data
        newEvents = newEvents.slice(page * rowsPerPage, (page + 1) * rowsPerPage); // Apply pagination
      } else {
        const response = await axios.get("http://localhost:7000/event_list", {
          params: {
            filter: "upcoming",
            search: query.trim(),
            tags: Array.from(selectedTags).join(','),
            page: page + 1,
            rowsPerPage: rowsPerPage,
          },
        });
        newEvents = response.data?.events || [];
        setTotalCount(response.data?.totalCount || 0); // Update totalCount from server response
      }

      setResults(newEvents);
      setShowDropdown(true);
    } catch (err) {
      setError("Search failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleTagClick = (tag) => {
    const updatedTags = new Set(selectedTags);
    if (updatedTags.has(tag)) {
      updatedTags.delete(tag);
    } else {
      updatedTags.add(tag);
    }
    setSelectedTags(updatedTags);
    setQuery("");
    handleSearch();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    handleSearch();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    handleSearch();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.3)" }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "60%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          variant="outlined"
          label="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <Button onClick={handleSearch} variant="contained" startIcon={<SearchIcon />}>
                Search
              </Button>
            ),
          }}
        />

        <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
          <Popper
            open={showDropdown && results.length > 0}
            anchorEl={inputRef.current}
            placement="bottom-start"
            style={{ zIndex: 1300, width: inputRef.current?.offsetWidth }}
          >
            <Paper elevation={3}>
              <List dense>
                {results.map((event) => (
                  <ListItem
                    key={event.eventID}
                    button
                    onClick={() => {
                      setShowDropdown(false);
                      onClose();
                      navigate(`/event/${event.eventID}`);
                    }}
                  >
                    <ListItemText
                      primary={event.name}
                      secondary={`${event.location || "Unknown"} | ${new Date(event.startTime).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        </ClickAwayListener>

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() => handleTagClick(tag)}
              sx={{
                backgroundColor: selectedTags.has(tag) ? "black" : "default",
                color: selectedTags.has(tag) ? "white" : "black",
                borderRadius: 2,
              }}
            />
          ))}
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" align="center" mt={2}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          {results.map((event) => (
            <Card key={event.eventID} sx={{ mb: 2 }}>
              {event.image && (
                <Box onClick={() => navigate(`/event/${event.eventID}`)} sx={{ cursor: "pointer" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image}
                    alt={event.name}
                  />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography color="textSecondary">
                  {`${event.location || "Unknown"} | ${new Date(event.startTime).toLocaleString()}`}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount} // Update this to reflect total count from server if available
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Modal>
  );
}
import React, { useState, useRef } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Chip,
  Box,
  Modal,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Pagination,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const TAGS = [
  "Wellness", "Networking", "Games", "Startups", "Technology", "Entrepreneurship",
  "Careers", "Sustainability", "Tech", "Books", "Art", "Coding", "Debate",
  "Movies", "Music", "Social", "Cultural", "Foods", "Volunteering"
];

const useMock = true; // Add flag for using mock data

export default function SearchPopup({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0); // Added totalCount state

  const inputRef = useRef();
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim() && selectedTags.size === 0) {
      setResults([]); // Clear results
      setTotalCount(0); // Clear total count
      return; // Return early
    }

    setLoading(true);
    setError(null);

    try {
      let newEvents = [];

      const params = {
        filter: status,
        search: query.trim(),
        tags: Array.from(selectedTags).join(','),
        page: page + 1,
        rowsPerPage: rowsPerPage,
      };

      if (useMock) {
        // Use mock data if flag is true
        const response = await axios.get("/mock_events.json");
        const mockEvents = response.data.events || [];
        newEvents = mockEvents.filter(event => 
          event.name.toLowerCase().includes(query.toLowerCase()) &&
          (selectedTags.size === 0 || Array.from(selectedTags).some(tag => event.tag?.toLowerCase() === tag.toLowerCase()))
        );
        setTotalCount(newEvents.length); // Update totalCount for mock data
        newEvents = newEvents.slice(page * rowsPerPage, (page + 1) * rowsPerPage); // Apply pagination
      } else {
        const response = await axios.get("http://localhost:7000/event_list", { params });
        if (response.status === 200) {
          newEvents = response.data?.events || [];
          setTotalCount(response.data?.totalCount || 0); // Update totalCount from server response
        } else {
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
      }

      setResults(newEvents);
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
          top: "5%",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "60%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'visible',
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
              <Button 
                onClick={handleSearch} 
                variant="contained" 
                sx={{
                  backgroundColor: "#235858",
                  color: "white",
                  '&:hover': {
                    backgroundColor: "#1b4444"
                  },
                  borderRadius: 2,
                  paddingX: 2
                }}
              >
                <SearchIcon sx={{ color: "white", fontSize: 24 }} />
              </Button>
            ),
          }}
        />

        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          displayEmpty
          variant="outlined"
          sx={{ mt: 2, width: "100%" }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="upcoming">Upcoming</MenuItem>
          <MenuItem value="current">Current</MenuItem>
          <MenuItem value="previous">Previous</MenuItem>
        </Select>

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() => handleTagClick(tag)}
              sx={{
                backgroundColor: selectedTags.has(tag) ? "#235858" : "#a8e847",
                color: "black",
                borderRadius: 2,
                fontWeight: 'bold',
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
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ maxHeight: '55vh', overflowY: 'auto', mt: 2 }}>
          {results.length === 0 ? (
            <Typography align="center">No results found.</Typography>
          ) : (
            results.map((event) => (
              <Card key={event.eventID} sx={{ mb: 2 }}>
                {event.image && (
                  <Box onClick={() => navigate(`/event/${event.eventID}`)} sx={{ cursor: "pointer" }}>
                    <CardMedia
                      component="img"
                      height="40"
                      image={event.image}
                      alt={event.name}
                    />
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography color="textSecondary">
                    {`${event.location || "Unknown"} | ${new Date(event.startTime).toLocaleString()} - ${new Date(event.endTime).toLocaleString()}`}
                  </Typography>
                  <Typography>{event.description}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Pagination
            count={Math.ceil(totalCount / rowsPerPage)}
            page={page + 1}
            onChange={(event, newPage) => {
              setPage(newPage - 1);
              handleSearch();
            }}
            sx={{ button: { color: "white", backgroundColor: "#235858", '&.Mui-selected': { backgroundColor: "#1b4444" } } }}
          />
        </Stack>
      </Box>
    </Modal>
  );
}
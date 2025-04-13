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
  Paper,
  TextField,
  Pagination,
  Checkbox,
  Button,
  TableCell,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HorizontalScrollBox from "./Styles/HorizontalScrollBox";
import formatDate from "../Functions/formatDate";

const mockNotices = [
  { id: 1, title: "Semester Start", content:"Welcome!", releaseTime: "2025-04-01 10:00:00" },
  { id: 2, title: "Exam Schedule Released", content:"Please check your exam schedule as soon as possible.", releaseTime: "2025-04-05 15:00:00" },
  { id: 3, title: "Main Library Closed", content:"The main library will be closed during the whole day.", releaseTime: "2025-04-10 12:00:00" },
];

const NoticeListTable = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const filtered = mockNotices.filter((n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setNotices(filtered);
  }, [searchTerm]);

  const handleSelectAll = () => {
    setSelectedIDs(notices.map((n) => n.id));
  };

  const handleUnselectAll = () => {
    setSelectedIDs([]);
  };

  const handleToggleCheckbox = (id) => {
    setSelectedIDs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    const remaining = notices.filter((n) => !selectedIDs.includes(n.id));
    setNotices(remaining);
    setSelectedIDs([]);
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2, width: "100%", overflow: "hidden" }}>
        <Box mb={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography sx={{ px: 1, py: 0.5 }} variant="h5" fontWeight="bold">
            Manage Notices
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={1}>
            <Button size="small" variant="outlined" onClick={handleSelectAll}>Select All</Button>
            <Button size="small" variant="outlined" color="error" onClick={handleUnselectAll}>Unselect All</Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={handleBatchDelete}
              disabled={selectedIDs.length === 0}
            >
              Delete Selected
            </Button>
          </Box>
          <TextField
            size="small"
            label="Search by Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Notice Title"
          />
        </Box>

        <HorizontalScrollBox>
          <Table size="small" sx={{ minWidth: "600px", width: "100%" }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIDs.length === notices.length && notices.length > 0}
                    indeterminate={selectedIDs.length > 0 && selectedIDs.length < notices.length}
                    onChange={(e) => (e.target.checked ? handleSelectAll() : handleUnselectAll())}
                  />
                </TableCell>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Title</b></TableCell>
                <TableCell><b>Release Time</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((notice) => (
                <TableRow
                    key={notice.id}
                    hover
                    sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                    >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIDs.includes(notice.id)}
                      onChange={() => handleToggleCheckbox(notice.id)}
                    />
                  </TableCell>
                  <TableCell>{notice.id}</TableCell>
                  <TableCell>{notice.title}</TableCell>
                  <TableCell>{formatDate(notice.releaseTime)}</TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </HorizontalScrollBox>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(notices.length / rowsPerPage)}
            page={page + 1}
            onChange={(_, newPage) => setPage(newPage - 1)}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NoticeListTable;
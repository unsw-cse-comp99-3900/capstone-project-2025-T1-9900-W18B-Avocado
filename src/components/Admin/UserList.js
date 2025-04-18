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
  Switch,
  Pagination,
  Chip,
  Divider,
  Button,
  Checkbox,
  TableCell,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FixedCell from "./FixedCell";
import SwitchUserStatusDialog from "./Dialogs/SwitchUserStatusDialog";
import UserInfoDialog from "./Dialogs/UserInfoDialog";
import HorizontalScrollBox from "./Styles/HorizontalScrollBox";
import { ErrAlert, SuccessAlert } from "../AlertFormats";
import { getErrorMessage } from "../Functions/getErrorMessage";

const statusInfoMap = {
  active: { label: "Active", color: "success" },
  inactive: { label: "Inactive", color: "error" },
};

function UserListTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const rowsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost/user_list?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const status = response.status;
      let data = {};
      let message = "";

      try {
        data = await response.json();
      } catch {
        message = `Unexpected error (${status})`;
      }

      if (!response.ok) {
        message = getErrorMessage(status, data);
        setSnackbar({ open: true, type: "error", message });
        setUsers([]);
        setTotalCount(0);
        return;
      }

      setUsers(data.users);
      setTotalCount(data.totalCount || data.users.length);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
      setTotalCount(0);
      setSnackbar({
        open: true,
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [searchTerm, page]);

  const handleChangePage = (_, newPage) => setPage(newPage - 1);
  const totalPages = Math.ceil(totalCount / 10);

  const handleToggleRequest = (user) => {
    setPendingUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSwitch = async () => {
    try {
      const res = await fetch("http://localhost/toggle_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userID: pendingUser.studentID }),
      });
      const status = res.status;
      if (!res.ok) {
        const message = getErrorMessage(status, {});
        setSnackbar({ open: true, type: "error", message });
        return;
      }
      setSnackbar({
        open: true,
        type: "success",
        message: "User status updated successfully!",
      });
      await fetchUsers();
      setSelectedIDs([]);
    } catch (err) {
      console.error("Toggle failed", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setConfirmDialogOpen(false);
      setPendingUser(null);
    }
  };

  const handleSelectAll = () => setSelectedIDs(users.map((u) => u.studentID));
  const handleUnselectAll = () => setSelectedIDs([]);

  const handleToggleCheckbox = (id) => {
    setSelectedIDs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBatchToggle = async () => {
    try {
      const res = await fetch("http://localhost/toggle_selected", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userIDs: selectedIDs }),
      });
      const status = res.status;

      if (!res.ok) {
        const message = getErrorMessage(status, {});
        setSnackbar({ open: true, type: "error", message });
        return;
      }
      setSnackbar({
        open: true,
        type: "success",
        message: "Users status updated successfully!",
      });
      await fetchUsers();
      setSelectedIDs([]);
    } catch (err) {
      console.error("Toggle failed", err);
      setSnackbar({
        open: true,
        type: "error",
        message: "Network error. Please try again.",
      });
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Box mb={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography sx={{ px: 1, py: 0.5 }} variant="h5" fontWeight="bold">Manage Users</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={handleSelectAll}>Select All</Button>
            <Button variant="outlined" size="small" color="error" onClick={handleUnselectAll}>Unselect All</Button>
            <Button variant="contained" size="small" color="error" disabled={selectedIDs.length === 0} onClick={handleBatchToggle}>
              Toggle Selected Status
            </Button>
          </Box>
          <TextField
            size="small"
            label="Search"
            placeholder="Name, Email or ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </Box>

        <HorizontalScrollBox>
          <Table size="small" sx={{ width: "100%" }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIDs.length === users.length && users.length > 0}
                    indeterminate={selectedIDs.length > 0 && selectedIDs.length < users.length}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleUnselectAll()}
                  />
                </TableCell>
                <FixedCell width="15%" minWidth={120} fontWeight="bold">Student ID</FixedCell>
                <FixedCell width="20%" minWidth={150} fontWeight="bold">Name</FixedCell>
                <FixedCell width="30%" minWidth={200} fontWeight="bold">Email</FixedCell>
                <FixedCell width="15%" minWidth={120} fontWeight="bold">Status</FixedCell>
                <FixedCell width="20%" minWidth={150} fontWeight="bold" align="center">Actions</FixedCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const currentStatus = user.active ? "active" : "inactive";
                const { label, color } = statusInfoMap[currentStatus];
                return (
                  <TableRow
                    key={user.studentID}
                    hover
                    sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIDs.includes(user.studentID)}
                        onChange={() => handleToggleCheckbox(user.studentID)}
                      />
                    </TableCell>
                    <FixedCell width="15%" minWidth={120}>{user.studentID}</FixedCell>
                    <FixedCell width="20%" minWidth={150}>{user.name}</FixedCell>
                    <FixedCell width="30%" minWidth={200}>{user.email}</FixedCell>
                    <FixedCell width="15%" minWidth={120}>
                      <Chip label={label} color={color} size="small" variant="outlined" />
                    </FixedCell>
                    <FixedCell width="20%" minWidth={150} align="center">
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <Tooltip title={user.active ? "Disable" : "Enable"}>
                          <Switch
                            checked={user.active}
                            onChange={() => handleToggleRequest(user)}
                            color="primary"
                            size="small"
                          />
                        </Tooltip>
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedUser(user);
                              setInfoDialogOpen(true);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </FixedCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </HorizontalScrollBox>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handleChangePage}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </Paper>
      {snackbar.type === "error" && <ErrAlert open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />}
      {snackbar.type === "success" && <SuccessAlert open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />}

      <SwitchUserStatusDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmSwitch}
        user={pendingUser}
      />
      <UserInfoDialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        user={selectedUser}
      />
    </Box>
  );
}

export default UserListTable;

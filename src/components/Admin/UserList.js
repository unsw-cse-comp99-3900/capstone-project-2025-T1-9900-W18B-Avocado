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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FixedCell from "./FixedCell";
import SwitchUserStatusDialog from "./Dialogs/SwitchUserStatusDialog";


const mockUsers = {
  users: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "student",
      active: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "administrator",
      active: false,
    },
  ],
  page: 1,
  pageSize: 10,
};

function UserListTable({ isStatic = true }) {
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;
  const [errorMsg, setErrorMsg] = useState("");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      let userList = [];
      if (isStatic) {
        userList = mockUsers.users;
        setTotalCount(userList.length);
      } else {
        const filterType = roleFilter.toLowerCase();
        const response = await fetch(
          `http://localhost:7000/user_list?filter=${filterType}&page=${page + 1}&limit=${rowsPerPage}`
        );

        if (!response.ok) {
          const data = await response.json();
          setErrorMsg(
            data.error || `❌ Error ${response.status}: Failed to fetch users.`
          );
          setUsers([]);
          setTotalCount(0);
          return;
        }

        const data = await response.json();
        userList = data.users;
        setTotalCount(data.totalCount || data.users.length);
      }

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        userList = userList.filter(
          (user) =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            String(user.id).includes(term)
        );
      }

      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsers([]);
      setTotalCount(0);
      setErrorMsg("❌ Network error: Unable to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
    setErrorMsg("");
  }, [roleFilter, searchTerm, page, isStatic]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleToggleRequest = (user) => {
    setPendingUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSwitch = async () => {
    if (!pendingUser) return;
    try {
      const response = await fetch("http://localhost:7000/admin/toggle-user-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: pendingUser.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Failed to update user status:", errorData);
      } else {
        console.log("✅ User status updated");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === pendingUser.id ? { ...u, active: !u.active } : u
          )
        );
      }
    } catch (err) {
      console.error("❌ Network error:", err);
    }
    setConfirmDialogOpen(false);
    setPendingUser(null);
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Manage Users
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              size="small"
              label="Search"
              placeholder="Name, Email or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="administrator">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {errorMsg && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Typography>
        )}

        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <FixedCell width={80} fontWeight="bold">ID</FixedCell>
              <FixedCell width={200} fontWeight="bold">Name</FixedCell>
              <FixedCell width={250} fontWeight="bold">Email</FixedCell>
              <FixedCell width={150} fontWeight="bold">Role</FixedCell>
              <FixedCell width={150} fontWeight="bold" align="center">Actions</FixedCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <FixedCell width={80}>{user.id}</FixedCell>
                <FixedCell width={200}>{user.name}</FixedCell>
                <FixedCell width={250}>{user.email}</FixedCell>
                <FixedCell width={150}>{user.role}</FixedCell>
                <FixedCell width={150} align="center">
                  <Tooltip title={user.active ? "Disable" : "Enable"}>
                    <Switch
                      checked={user.active}
                      onChange={() => handleToggleRequest(user)}
                      color="primary"
                      size="small"
                    />
                  </Tooltip>
                  <Tooltip title="Preview">
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
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

      <SwitchUserStatusDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmSwitch}
        user={pendingUser}
      />
    </Box>
  );
}

export default UserListTable;
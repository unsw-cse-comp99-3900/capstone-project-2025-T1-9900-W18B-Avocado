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

const statusInfoMap = {
  active: { label: "Active", color: "success" },
  inactive: { label: "Inactive", color: "error" },
};

const mockUsers = {
  users: [
    {
      id: "5299241",
      name: "Zach",
      role: "Student",
      isArcMember: true,
      email: "2@knowwhatson.com",
      faculty: "SCI",
      degree: "PSYC Postgraduate",
      graduationYear: "2025",
      eventHistory: ["Event A", "Event B", "Event C"],
      rewards: 10,
      active: true,
      rewardPointsDetail: {},
    },
    {
      id: "5299242",
      name: "Hazel",
      role: "Student",
      isArcMember: true,
      email: "3@knowwhatson.com",
      faculty: "MED",
      degree: "MEDH Postgraduate",
      graduationYear: "2028",
      eventHistory: ["Event A", "Event B", "Event C", "Event D"],
      rewards: 20,
      active: true,
    },
    {
      id: "5299243",
      name: "Diko",
      role: "Student",
      isArcMember: true,
      email: "4@knowwhatson.com",
      faculty: "ENG",
      degree: "CIVL Research",
      graduationYear: "2025",
      eventHistory: ["Event A", "Event B", "Event C", "Event D", "Event E", "Event F"],
      rewards: 30,
      active: false,
    },
  ],
  page: 1,
  pageSize: 10,
  totalCount: 100,
  totalPages: 10,
};

function UserListTable({ isStatic = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const fetchUsers = async () => {
    let userList = [];
    if (isStatic) {
      userList = mockUsers.users;
      const filtered = userList.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(user.id).includes(searchTerm)
      );
      setUsers(filtered);
      setTotalCount(mockUsers.totalCount);
    }
    // 真实请求可补充 else 分支
  };

  useEffect(() => {
    fetchUsers();
    setErrorMsg("");
  }, [searchTerm, page, isStatic]);

  const handleChangePage = (_, newPage) => setPage(newPage - 1);
  const totalPages = Math.ceil(totalCount / 10);

  const handleToggleRequest = (user) => {
    setPendingUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSwitch = async () => {
    // 省略实际逻辑
    setConfirmDialogOpen(false);
    setPendingUser(null);
  };

  const handleSelectAll = () => {
    setSelectedIDs(users.map((u) => u.id));
  };

  const handleUnselectAll = () => {
    setSelectedIDs([]);
  };

  const handleToggleCheckbox = (id) => {
    setSelectedIDs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
        <Box mb={1} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Typography sx={{ px: 1, py: 0.5 }} variant="h5" fontWeight="bold">Manage Users</Typography>
          {errorMsg && (
            <Typography variant="body2" color="error" sx={{ maxWidth: 400, wordBreak: "break-word" }}>
              {errorMsg}
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
          <Box display="flex" gap={1}>
            <Button variant="outlined" size="small" onClick={handleSelectAll}>Select All</Button>
            <Button variant="outlined" size="small" color="error" onClick={handleUnselectAll}>Unselect All</Button>
            <Button variant="contained" size="small" color="error" disabled={selectedIDs.length === 0}>Change Selected Status</Button>
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
                    key={user.id}
                    hover
                    sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIDs.includes(user.id)}
                        onChange={() => handleToggleCheckbox(user.id)}
                      />
                    </TableCell>
                    <FixedCell width="15%" minWidth={120}>{user.id}</FixedCell>
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
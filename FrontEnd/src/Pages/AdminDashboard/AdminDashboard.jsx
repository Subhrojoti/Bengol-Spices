import { useState } from "react";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

/* ===================== MOCK DATA (Replace with API later) ===================== */
const USERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    status: "PENDING",
  },
  {
    id: 2,
    name: "Anita Verma",
    email: "anita@example.com",
    status: "APPROVED",
  },
  {
    id: 3,
    name: "Sourav Das",
    email: "sourav@example.com",
    status: "PENDING",
  },
];

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");

    navigate("/admin/login", { replace: true });
  };

  const filteredUsers =
    statusFilter === "ALL"
      ? USERS
      : USERS.filter((user) => user.status === statusFilter);

  const getStatusChip = (status) => {
    return status === "APPROVED" ? (
      <Chip label="Approved" color="success" size="small" />
    ) : (
      <Chip label="Pending" color="warning" size="small" />
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* ===================== HEADER ===================== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Admin Dashboard
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Manage agent applications and approval status
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none", fontWeight: 600 }}>
          Logout
        </Button>
      </Box>

      {/* ===================== FILTER ===================== */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* ===================== USER TABLE ===================== */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusChip(user.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

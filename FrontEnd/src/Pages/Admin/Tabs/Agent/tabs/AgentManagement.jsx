import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Card,
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
  Grid,
  Tooltip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import {
  agentList,
  approveAgent,
  rejectAgent,
} from "../../../../../api/services";
import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AgentManagement() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [agents, setAgents] = useState([]);
  const [openRow, setOpenRow] = useState(null);

  const navigate = useNavigate();

  const handleApprove = async (agent) => {
    try {
      await approveAgent(agent.agentId);

      toast.success(`Agent ${agent.name} approved`);

      // Update UI locally
      setAgents((prev) =>
        prev.map((a) =>
          a.agentId === agent.agentId ? { ...a, status: "APPROVED" } : a,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve agent");
    }
  };

  const handleReject = async (agent) => {
    try {
      await rejectAgent(agent.agentId);

      toast.error(`Agent ${agent.name} rejected`);

      setAgents((prev) =>
        prev.map((a) =>
          a.agentId === agent.agentId ? { ...a, status: "REJECTED" } : a,
        ),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject agent");
    }
  };

  /* ===================== FETCH AGENTS ===================== */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await agentList();
        setAgents(data.agents || []);
      } catch (error) {
        console.error("Failed to fetch agents", error);
        setAgents([]);
      }
    };

    fetchAgents();
  }, []);

  /* ===================== FILTER LOGIC ===================== */
  const filteredAgents =
    statusFilter === "ALL"
      ? agents
      : agents.filter((agent) => agent.status === statusFilter);

  /* ===================== STATUS CHIP ===================== */
  const getStatusChip = (status) => {
    switch (status) {
      case "APPROVED":
        return <Chip label="Approved" color="success" size="small" />;
      case "PENDING":
        return <Chip label="Pending" color="warning" size="small" />;
      case "REJECTED":
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
      {/* ===== HEADER (TITLE + FILTER) ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 2,
        }}>
        <FormControl size="small">
          <Select
            value={statusFilter}
            displayEmpty
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              "& .MuiSelect-select": {
                py: 0.5, // reduce vertical padding
                px: 1.5,
              },
            }}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ===================== AGENT TABLE ===================== */}
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
        <TableContainer
          sx={{
            flex: 1,
            overflowY: "auto",

            marginRight: "-2rem",
            paddingRight: "2rem",
          }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    backgroundColor: "#f3f4f6",
                    fontWeight: 600,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  },

                  // ✅ LEFT CORNER
                  "& th:first-of-type": {
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  },

                  // ✅ RIGHT CORNER
                  "& th:last-of-type": {
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                  },
                }}>
                <TableCell>Agent ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No agents found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent) => {
                  const isOpen = openRow === agent._id;

                  return (
                    <React.Fragment key={agent._id}>
                      <TableRow hover>
                        <TableCell>{agent.agentId}</TableCell>
                        <TableCell>{agent.name}</TableCell>
                        <TableCell>{agent.email}</TableCell>
                        <TableCell>{getStatusChip(agent.status)}</TableCell>

                        {/* ACTIONS COLUMN */}
                        <TableCell width={120} align="right">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}>
                            {/* SHOW ONLY FOR PENDING */}
                            {agent.status === "PENDING" && (
                              <>
                                {/* APPROVE */}
                                <Tooltip title="Approve">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircleOutlineIcon />}
                                    onClick={() => handleApprove(agent)}
                                    sx={{ textTransform: "none" }}>
                                    Approve
                                  </Button>
                                </Tooltip>

                                {/* REJECT */}
                                <Tooltip title="Reject">
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="error"
                                    startIcon={<HighlightOffIcon />}
                                    onClick={() => handleReject(agent)}
                                    sx={{ textTransform: "none" }}>
                                    Reject
                                  </Button>
                                </Tooltip>
                              </>
                            )}

                            {/* EXPAND / COLLAPSE — ALWAYS VISIBLE */}
                            <IconButton
                              size="small"
                              onClick={() =>
                                setOpenRow(isOpen ? null : agent._id)
                              }>
                              {isOpen ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                      {/* ================= DISCLOSURE ROW ================= */}
                      <TableRow>
                        <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                          <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                bgcolor: "grey.50",
                              }}>
                              {/* ===== SUB PANEL CONTAINER ===== */}
                              <Box
                                sx={{
                                  position: "relative",
                                  p: 3,
                                  borderRadius: 2,
                                  bgcolor: "background.paper",
                                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                                  overflow: "hidden",
                                }}>
                                {/* LEFT ACCENT STRIP */}
                                <Box
                                  sx={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 4,
                                    bgcolor: "primary.main",
                                  }}
                                />

                                <Grid container spacing={4}>
                                  {/* ===== LEFT CARD: BASIC DETAILS ===== */}
                                  <Grid item xs={12} md={6}>
                                    <Box
                                      sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        bgcolor: "grey.100",
                                      }}>
                                      <Stack spacing={2.5}>
                                        {[
                                          {
                                            icon: (
                                              <PhoneIcon fontSize="small" />
                                            ),
                                            label: "Phone",
                                            value: agent.phone,
                                          },
                                          {
                                            icon: <HomeIcon fontSize="small" />,
                                            label: "Address",
                                            value: agent.address,
                                          },
                                          {
                                            icon: (
                                              <BadgeIcon fontSize="small" />
                                            ),
                                            label: "Role",
                                            value: agent.role,
                                          },
                                        ].map(({ icon, label, value }) => (
                                          <Stack
                                            key={label}
                                            direction="row"
                                            spacing={2}
                                            alignItems="flex-start">
                                            <Box
                                              sx={{
                                                minWidth: 32,
                                                height: 32,
                                                borderRadius: "50%",

                                                color: "primary.main",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}>
                                              {icon}
                                            </Box>

                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary">
                                                {label}
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                fontWeight={500}>
                                                {value}
                                              </Typography>
                                            </Box>
                                          </Stack>
                                        ))}

                                        {agent.rejectionReason && (
                                          <Stack direction="row" spacing={2}>
                                            <Box
                                              sx={{
                                                minWidth: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                bgcolor: "error.light",
                                                color: "error.main",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}>
                                              <ErrorOutlineIcon fontSize="small" />
                                            </Box>

                                            <Box>
                                              <Typography
                                                variant="caption"
                                                color="error">
                                                Rejection Reason
                                              </Typography>
                                              <Typography
                                                variant="body2"
                                                color="error">
                                                {agent.rejectionReason}
                                              </Typography>
                                            </Box>
                                          </Stack>
                                        )}
                                      </Stack>
                                    </Box>
                                  </Grid>

                                  {/* ===== RIGHT CARD: DOCUMENTS ===== */}
                                  <Grid item xs={12} md={6}>
                                    <Box
                                      sx={{
                                        p: 2.5,
                                        borderRadius: 2,
                                        bgcolor: "grey.100",
                                      }}>
                                      <Stack spacing={1}>
                                        {[
                                          {
                                            label: "Aadhaar",
                                            url: agent.documents?.aadhaar,
                                          },
                                          {
                                            label: "PAN",
                                            url: agent.documents?.pan,
                                          },
                                          {
                                            label: "Photo",
                                            url: agent.documents?.photo,
                                          },
                                        ].map(
                                          (doc) =>
                                            doc.url && (
                                              <Stack
                                                key={doc.label}
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                sx={{
                                                  p: 1,
                                                  borderRadius: 1.5,
                                                  bgcolor: "background.paper",
                                                  border: "1px solid",
                                                  borderColor: "divider",
                                                }}>
                                                <Stack
                                                  direction="row"
                                                  spacing={1.5}>
                                                  <DescriptionIcon
                                                    fontSize="small"
                                                    color="action"
                                                  />
                                                  <Typography variant="body2">
                                                    {doc.label}
                                                  </Typography>
                                                </Stack>

                                                <IconButton
                                                  size="small"
                                                  color="primary"
                                                  onClick={() =>
                                                    window.open(
                                                      doc.url,
                                                      "_blank",
                                                    )
                                                  }>
                                                  <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                              </Stack>
                                            ),
                                        )}
                                      </Stack>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{ height: 12, border: 0, p: 0 }}
                        />
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { employeeRoutes } from "../../config/employeeRoutes";
import LogoutIcon from "@mui/icons-material/Logout";

const COLLAPSED_WIDTH = 64;
const EXPANDED_WIDTH = 260;

const EmployeeSidePanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");

    navigate("/employee/login", { replace: true });
  };

  return (
    <Box
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "width 220ms ease",
        backdropFilter: "blur(20px)",

        /* EMPLOYEE THEME */
        background:
          "linear-gradient(140deg, rgba(232, 218, 255, 0.75), rgba(117, 48, 228, 0.75))",

        borderRight: "1px solid rgba(255,255,255,0.3)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
      }}>
      {/* HEADER */}
      <Box
        sx={{
          p: 4,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "flex-start" : "center",
          transition: "all 200ms ease",
        }}>
        {expanded ? (
          <Typography variant="h6" fontWeight={700} noWrap>
            Employee Panel
          </Typography>
        ) : (
          <Typography fontWeight={700}>E</Typography>
        )}
      </Box>

      {/* MENU */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <List
          sx={{
            px: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}>
          {employeeRoutes.map((route) => {
            const Icon = route.icon;

            const isActive = matchPath(
              { path: `/employee/${route.path}`, end: true },
              location.pathname,
            );

            return (
              <ListItem key={route.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(`/employee/${route.path}`)}
                  sx={{
                    minHeight: 48,
                    justifyContent: expanded ? "flex-start" : "center",
                    px: expanded ? 2 : 1.5,
                    borderRadius: 2,
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.25)"
                      : "transparent",
                    transition: "all 200ms ease",
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: expanded ? 2 : 0,
                      justifyContent: "center",
                      color: isActive ? "#7c28e2" : "#1c1f23",
                    }}>
                    <Icon />
                  </ListItemIcon>

                  <ListItemText
                    primary={route.label}
                    sx={{
                      opacity: expanded ? 1 : 0,
                      whiteSpace: "nowrap",
                      transition: "opacity 150ms ease",
                    }}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

          {/* LOGOUT — STICKED TO BOTTOM */}
          <ListItem disablePadding sx={{ mt: "auto" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: expanded ? "flex-start" : "center",
                px: expanded ? 2 : 1.5,
                borderRadius: 2,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: expanded ? 2 : 0,
                  justifyContent: "center",
                  color: "#ffffff",
                }}>
                <LogoutIcon />
              </ListItemIcon>

              <ListItemText
                primary="Logout"
                sx={{
                  opacity: expanded ? 1 : 0,
                  whiteSpace: "nowrap",
                  transition: "opacity 150ms ease",
                }}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default EmployeeSidePanel;

import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import EmployeeSidePanel from "../../components/sidebar/EmployeeSidePanel";

const EmployeeBase = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <EmployeeSidePanel />

      <Box sx={{ flexGrow: 1, minHeight: "100vh", marginLeft: "5%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default EmployeeBase;

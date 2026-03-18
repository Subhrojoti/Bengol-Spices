import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import DuePayments from "./tabs/DuePayments";
import OverDuePayments from "./tabs/OverDuePayments";
import CompletedPayments from "./tabs/CompletedPayments";

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="p-6 w-full">
      {/* Tabs */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: "10px",
            },
            "& .MuiTab-root": {
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              fontWeight: 500,
              minHeight: "40px",
              padding: "8px 20px",
            },
            "& .Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff !important",
            },
          }}>
          <Tab label="Due Payments" />
          <Tab label="Overdue Payments" />
          <Tab label="Completed Payments" />
        </Tabs>
      </Box>

      {/* Content */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
        {activeTab === 0 && <DuePayments />}
        {activeTab === 1 && <OverDuePayments />}
        {activeTab === 2 && <CompletedPayments />}
      </div>
    </div>
  );
};

export default PaymentManagement;

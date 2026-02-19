import React from "react";
import AgentHeader from "../../components/header/AgentHeader.jsx";
import { Outlet } from "react-router-dom";

const MarketingHub = () => {
  return (
    <div>
      <AgentHeader />
      <Outlet />
    </div>
  );
};

export default MarketingHub;

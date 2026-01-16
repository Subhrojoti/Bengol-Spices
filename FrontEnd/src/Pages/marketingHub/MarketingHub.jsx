import React from "react";
import Header from "../../components/header/Header.JSX";
import { Outlet } from "react-router-dom";

const MarketingHub = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default MarketingHub;

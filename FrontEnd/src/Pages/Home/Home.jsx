import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

const Home = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default memo(Home);

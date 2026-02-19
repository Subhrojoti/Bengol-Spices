import { memo } from "react";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default memo(Home);

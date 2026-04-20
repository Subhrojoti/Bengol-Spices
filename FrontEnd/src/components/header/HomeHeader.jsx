import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { footerRoutes } from "../../config/footerRoutes";
import logoMain from "../../assets/logo/Logo_Final.png";
import { AppBar, Toolbar } from "@mui/material";

const HIDDEN_TABS = ["privacy", "terms", "cookies"];

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const visibleTabs = React.useMemo(
    () => footerRoutes.filter((r) => !HIDDEN_TABS.includes(r.path)),
    [],
  );

  const firstTab = visibleTabs[0]?.path;

  React.useEffect(() => {
    if (location.pathname === "/" && firstTab) {
      navigate(`/${firstTab}`, { replace: true });
    }
  }, [location.pathname, firstTab, navigate]);

  // derive active tab
  const activeTab = React.useMemo(() => {
    const current = location.pathname.split("/")[1];
    return current || firstTab;
  }, [location.pathname, firstTab]);

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
      }}>
      <Toolbar
        disableGutters
        sx={{
          maxWidth: 1400,
          mx: "auto",
          width: "100%",
          minHeight: 64,
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          px: {
            xs: 2,
            md: 10,
            lg: 10,
            xl: 5,
          },
          py: 1,
        }}>
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div
            className=" cursor-pointer flex items-center justify-center"
            onClick={() => navigate("/")}>
            <img
              src={logoMain}
              alt="Bengol Spices"
              className="h-14 object-contain"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6">
          {visibleTabs.map((route) => {
            const isActive = location.pathname === `/${route.path}`;

            return (
              <button
                key={route.path}
                onClick={() => navigate(`/${route.path}`)}
                className={`text-sm font-medium transition relative ${
                  isActive
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}>
                {route.path.toUpperCase()}

                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HomeHeader;

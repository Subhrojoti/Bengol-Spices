import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { footerRoutes } from "../../config/footerRoutes";

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // derive active tab from URL
  const activeTab = React.useMemo(() => {
    const current = location.pathname.split("/")[1];
    return current || "about";
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between px-6 md:px-20 lg:px-32 xl:px-40 py-2 bg-white shadow-sm">
      {/* LEFT: Logo + Active Tab */}
      <div className="flex items-center gap-4">
        {/* LOGO */}
        <div
          className="bg-orange-600 p-1.5 rounded-xl cursor-pointer"
          onClick={() => navigate("/")}>
          <h1 className="text-sm font-semibold tracking-wide text-white">
            Bengol
          </h1>
          <h1 className="text-sm font-semibold tracking-wide text-white pl-6 -mt-1">
            Spices
          </h1>
        </div>

        {/* ACTIVE TAB NAME */}
        <h1 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
          {activeTab}
        </h1>
      </div>

      {/* RIGHT: TABS */}
      <div className="hidden md:flex items-center gap-6">
        {footerRoutes
          .filter(
            (route) => !["privacy", "terms", "cookies"].includes(route.path),
          )
          .map((route) => {
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

                {/* underline indicator */}
                {isActive && (
                  <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-orange-600 rounded-full" />
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default HomeHeader;

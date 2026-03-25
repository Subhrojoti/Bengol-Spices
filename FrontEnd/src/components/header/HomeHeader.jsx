import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { footerRoutes } from "../../config/footerRoutes";

const HIDDEN_TABS = ["privacy", "terms", "cookies"];

const HomeHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const visibleTabs = React.useMemo(
    () => footerRoutes.filter((r) => !HIDDEN_TABS.includes(r.path)),
    [],
  );

  const firstTab = visibleTabs[0]?.path;

  // ✅ REDIRECT when "/"
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
    <div className="flex items-center justify-between px-6 md:px-20 lg:px-32 xl:px-40 py-2 bg-white shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-4">
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

        <h1 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">
          {activeTab}
        </h1>
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
    </div>
  );
};

export default HomeHeader;

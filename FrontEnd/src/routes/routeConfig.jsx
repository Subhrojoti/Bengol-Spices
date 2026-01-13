import Home from "../pages/Home/Home";
import { MarketingHub, marketingRoutes } from "../config/marketingRoutes";
import AgentLogin from "../pages/Auth/Login/AgentLogin";
import AdminLogin from "../pages/Auth/Login/AdminLogin";
import ProtectedRoute from "../routes/ProtectedRoute";
import Onboarding from "../pages/Auth/Onboarding";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";

export const routes = [
  /* ===================== PUBLIC ROUTES ===================== */
  {
    path: "/agent/login",
    element: <AgentLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },

  /* ===================== ADMIN PROTECTED ===================== */
  {
    element: <ProtectedRoute redirectTo="/admin/login" />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },

  /* ===================== AGENT / APP PROTECTED ===================== */
  {
    element: <ProtectedRoute redirectTo="/agent/login" />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "marketing",
            element: <MarketingHub />,
            children: [
              ...marketingRoutes.map((route) => {
                const Component = route.component;
                return {
                  path: route.path,
                  element: <Component />,
                };
              }),

              /* Default route → first marketing tab */
              {
                index: true,
                element: (() => {
                  const DefaultComponent = marketingRoutes[0].component;
                  return <DefaultComponent />;
                })(),
              },
            ],
          },
        ],
      },
    ],
  },
];

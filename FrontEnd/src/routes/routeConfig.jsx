import Home from "../pages/Home/Home";
import { MarketingHub, marketingRoutes } from "../config/marketingRoutes";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ProtectedRoute from "../routes/ProtectedRoute";
import Onboarding from "../pages/Auth/Onboarding";

export const routes = [
  // ---------- PUBLIC ----------
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  // ---------- PROTECTED ----------
  {
    element: <ProtectedRoute />, // Auth guard
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

              // Default route → first tab
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

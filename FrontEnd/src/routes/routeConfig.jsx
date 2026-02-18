import Home from "../pages/Home/Home";
import { MarketingHub, marketingRoutes } from "../config/marketingRoutes";
import AgentLogin from "../pages/Auth/Login/AgentLogin";
import AdminLogin from "../pages/Auth/Login/AdminLogin";
import ProtectedRoute from "../routes/ProtectedRoute";
import Onboarding from "../pages/Auth/Agent/AgentOnboarding";
import { adminRoutes } from "../config/adminRoutes";
import ProfileSettings from "../pages/ProfileSettings/ProfileSettings";
import SetPassword from "../pages/Auth/Agent/AgentSetPassword";
import DeliveryPartnerRegister from "../pages/Auth/DeliveryPartner/DeliveryPartnerRegister";
import AdminBase from "../pages/Admin/AdminBase";
import ProductDetails from "../pages/Admin/Tabs/AllProducts/ProductDetails";
import DeliveryLogin from "../pages/Auth/Login/DeliveryLogin";

export const routes = [
  /* ===================== PUBLIC ROUTES ===================== */
  {
    path: "/agent/login",
    element: <AgentLogin />,
  },
  {
    path: "/delivery/login",
    element: <DeliveryLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/agent-onboarding",
    element: <Onboarding />,
  },
  {
    path: "/agent-set-password",
    element: <SetPassword />,
  },
  {
    path: "/delivery-partner-register",
    element: <DeliveryPartnerRegister />,
  },

  /* ===================== ADMIN PROTECTED ===================== */
  {
    element: <ProtectedRoute redirectTo="/admin/login" />,
    children: [
      {
        path: "/admin",
        element: <AdminBase />,
        children: [
          ...adminRoutes.map((route) => {
            const Component = route.component;
            return {
              path: route.path,
              element: <Component />,
            };
          }),
          {
            path: "allproducts/:productId",
            element: <ProductDetails />,
          },
          {
            index: true,
            element: adminRoutes[0].element,
          },
        ],
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
            path: "profile/settings",
            element: <ProfileSettings />,
          },
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

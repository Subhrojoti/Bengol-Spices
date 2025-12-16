import { lazy } from "react";

export const MarketingHub = lazy(() =>
  import("../pages/MarketingHub/MarketingHub")
);

export const marketingRoutes = [
  {
    label: "Overview",
    path: "overview",
    fullPath: "/marketing/overview",
    component: lazy(() => import("../pages/MarketingHub/Tabs/Overview")),
  },
  {
    label: "Store Creation",
    path: "storeCreation",
    fullPath: "/marketing/storeCreation",
    component: lazy(() => import("../pages/MarketingHub/Tabs/StoreCreation")),
  },
  {
    label: "Order Create",
    path: "orderCreation",
    fullPath: "/marketing/orderCreation",
    component: lazy(() => import("../pages/MarketingHub/Tabs/OrderCreation")),
  },
  {
    label: "Payments",
    path: "payments",
    fullPath: "/marketing/payments",
    component: lazy(() => import("../pages/MarketingHub/Tabs/Payments")),
  },
  {
    label: "Returns",
    path: "returns",
    fullPath: "/marketing/returns",
    component: lazy(() => import("../pages/MarketingHub/Tabs/Returns")),
  },
];

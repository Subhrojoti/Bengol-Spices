import { lazy } from "react";

export const MarketingHub = lazy(
  () => import("../pages/MarketingHub/MarketingHub"),
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
    label: "My Stores",
    path: "myStores",
    fullPath: "/marketing/myStores",
    component: lazy(
      () => import("../pages/MarketingHub/Tabs/MyStores/MyStoresBase"),
    ),
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

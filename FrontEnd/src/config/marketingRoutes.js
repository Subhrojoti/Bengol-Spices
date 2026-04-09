import { lazy } from "react";

export const MarketingHub = lazy(
  () => import("../Pages/marketingHub/MarketingHub.jsx"),
);

export const marketingRoutes = [
  {
    label: "Overview",
    path: "overview",
    fullPath: "/marketing/overview",
    component: lazy(
      () => import("../Pages/marketingHub/Tabs/Overview/Overview"),
    ),
  },
  {
    label: "Store Creation",
    path: "storeCreation",
    fullPath: "/marketing/storeCreation",
    component: lazy(() => import("../Pages/marketingHub/Tabs/StoreCreation")),
  },
  {
    label: "My Stores",
    path: "myStores",
    fullPath: "/marketing/myStores",
    component: lazy(
      () => import("../Pages/marketingHub/Tabs/MyStores/MyStoresBase"),
    ),
  },
  {
    label: "Targets",
    path: "daily-targets",
    fullPath: "/marketing/daily-targets",
    component: lazy(() => import("../Pages/marketingHub/Tabs/Targets/Targets")),
  },

  {
    label: "Payments",
    path: "payments",
    fullPath: "/marketing/payments",
    component: lazy(
      () => import("../Pages/marketingHub/Tabs/Payments/PaymentManagement"),
    ),
  },
  {
    label: "Leaderboard",
    path: "leaderboard",
    fullPath: "/marketing/leaderboard",
    component: lazy(
      () => import("../Pages/marketingHub/Tabs/Leaderboard/Leaderboard"),
    ),
  },
  {
    label: "Wallet",
    path: "wallet",
    fullPath: "/marketing/wallet",
    component: lazy(() => import("../Pages/marketingHub/Tabs/Wallet/Wallet")),
  },
];

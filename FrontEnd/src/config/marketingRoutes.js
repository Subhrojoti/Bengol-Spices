import { lazy } from "react";

export const MarketingHub = lazy(
  () => import("../Pages/MarketingHub/MarketingHub"),
);

export const marketingRoutes = [
  {
    label: "Overview",
    path: "overview",
    fullPath: "/marketing/overview",
    component: lazy(
      () => import("../Pages/MarketingHub/Tabs/Overview/Overview"),
    ),
  },
  {
    label: "Store Creation",
    path: "storeCreation",
    fullPath: "/marketing/storeCreation",
    component: lazy(() => import("../Pages/MarketingHub/Tabs/StoreCreation")),
  },
  {
    label: "My Stores",
    path: "myStores",
    fullPath: "/marketing/myStores",
    component: lazy(
      () => import("../Pages/MarketingHub/Tabs/MyStores/MyStoresBase"),
    ),
  },
  {
    label: "Targets",
    path: "daily-targets",
    fullPath: "/marketing/daily-targets",
    component: lazy(() => import("../Pages/MarketingHub/Tabs/Targets/Targets")),
  },

  {
    label: "Payments",
    path: "payments",
    fullPath: "/marketing/payments",
    component: lazy(
      () => import("../Pages/MarketingHub/Tabs/Payments/PaymentManagement"),
    ),
  },
  {
    label: "Leaderboard",
    path: "leaderboard",
    fullPath: "/marketing/leaderboard",
    component: lazy(
      () => import("../Pages/MarketingHub/Tabs/Leaderboard/Leaderboard"),
    ),
  },
  {
    label: "Wallet",
    path: "wallet",
    fullPath: "/marketing/wallet",
    component: lazy(() => import("../Pages/MarketingHub/Tabs/Wallet/Wallet")),
  },
];

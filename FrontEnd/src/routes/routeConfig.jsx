import { lazy } from 'react';
import Home from "../pages/Home/Home";

// ----------- Marketing Hub Layout -----------
const MarketingHub = lazy(() => import('../pages/MarketingHub/MarketingHub'));

// ----------- Marketing Tabs -----------
const Overview = lazy(() => import('../pages/MarketingHub/Tabs/Overview'));
const StoreCreation = lazy(() => import('../pages/MarketingHub/Tabs/StoreCreation'));
const OrderCreation = lazy(() => import('../pages/MarketingHub/Tabs/OrderCreation'));
const Payments = lazy(() => import('../pages/MarketingHub/Tabs/Payments'));
const Returns = lazy(() => import('../pages/MarketingHub/Tabs/Returns'));

// ----------- Future Hubs (just placeholder imports) -----------
// const DeliveryHub = lazy(() => import('../pages/DeliveryHub/DeliveryHub'));
// const OrderManagementHub = lazy(() => import('../pages/OrderManagementHub/OrderManagementHub'));


export const routes = [
  {
    path: '/',
    element: <Home />,
    children: [
      // ========== MARKETING HUB ==========
      {
        path: 'marketing',
        element: <MarketingHub />,        // parent layout
        children: [
          { path: 'overview', element: <Overview /> },
          { path: 'storeCreation', element: <StoreCreation /> },
          { path: 'orderCreation', element: <OrderCreation /> },
          { path: 'payments', element: <Payments /> },
          { path: 'returns', element: <Returns /> },

          // optional: default tab when visiting /marketing
          { index: true, element: <Overview /> },
        ],
      },

      // ========== DELIVERY HUB (example for future) ==========
      // {
      //   path: 'delivery',
      //   element: <DeliveryHub />,
      //   children: [
      //     { path: 'overview', element: <DeliveryOverview /> },
      //     ...
      //   ],
      // },

      // ========== ORDER MANAGEMENT HUB (example for future) ==========
      // {
      //   path: 'orders',
      //   element: <OrderManagementHub />,
      //   children: [
      //     { path: 'pending', element: <PendingOrders /> },
      //     { path: 'completed', element: <CompletedOrders /> },
      //   ],
      // },
    ],
  },
];

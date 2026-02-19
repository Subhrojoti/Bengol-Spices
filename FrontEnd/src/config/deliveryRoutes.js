import DeliveryPanel from "../pages/Delivery/Tabs/DeliveryPanel";
import AllOrders from "../pages/Delivery/Tabs/AllOrders";
import OrderReturn from "../pages/Delivery/Tabs/OrderReturn";

export const deliveryRoutes = [
  {
    label: "Delivery Panel",
    path: "delivery-panel",
    fullPath: "/delivery/delivery-panel",
    component: DeliveryPanel,
  },
  {
    label: "All Orders",
    path: "all-orders",
    fullPath: "/delivery/all-orders",
    component: AllOrders,
  },
  {
    label: "Returns",
    path: "order-returns",
    fullPath: "/delivery/order-returns",
    component: OrderReturn,
  },
];
